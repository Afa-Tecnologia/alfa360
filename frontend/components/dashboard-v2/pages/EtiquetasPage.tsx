'use client';
import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table';
import { ProductTable } from '../estoque/ProductEstoqueTable';
import { EtiquetaPreview } from '../etiquetas/components/EtiquetaPreview';
import { ImprimirEtiquetasButton } from '../etiquetas/components/ImprimirEtiquetasButton';
import { MultiSelectVariants } from '../etiquetas/components/MultiSelectVariants';
import {
  EtiquetaVariante,
  EtiquetaProduto,
} from '../etiquetas/types/etiqueta.types';
import etiquetasService from '@/services/etiquetas/etiquetasService';

// Simulação de API (substitua por chamada real)
const fetchProdutos = async (page: number, perPage: number, query: string) => {
  const response = await etiquetasService.getProducts(page, perPage, query);
  return {
    data: response.data,
    total: response.total,
  };
};

// Adapta EtiquetaProduto para ProductTable
function mapEtiquetaProdutoToProduct(p: EtiquetaProduto) {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    quantity: p.quantity,
    selling_price: Number(p.selling_price),
    _original: p, // para referência
  };
}

const EtiquetasPage: React.FC = () => {
  // Configuração dinâmica de etiquetas
  const [etiquetaWidth, setEtiquetaWidth] = useState(32); // mm
  const [etiquetaHeight, setEtiquetaHeight] = useState(25); // mm
  const [colunas, setColunas] = useState(3);

  // Estado de produtos e paginação
  const [produtos, setProdutos] = useState<EtiquetaProduto[]>([]);
  const [totalProdutos, setTotalProdutos] = useState(0);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [busca, setBusca] = useState('');
  const [loading, setLoading] = useState(false);

  // Estado de seleção múltipla de produtos
  const [produtosSelecionados, setProdutosSelecionados] = useState<
    EtiquetaProduto[]
  >([]);
  // Estado de variantes/quantidades por produto
  const [selecoes, setSelecoes] = useState<
    Record<
      number,
      { variantes: EtiquetaVariante[]; quantidades: Record<number, number> }
    >
  >({});

  const printRef = useRef<HTMLDivElement>(null);

  // Buscar produtos ao carregar/paginar/buscar
  useEffect(() => {
    setLoading(true);
    fetchProdutos(page, perPage, busca).then((res) => {
      setProdutos(res.data);
      setTotalProdutos(res.total);
      setLoading(false);
    });
  }, [page, perPage, busca]);

  // Handler para seleção múltipla de produtos
  const handleToggleProduto = (produto: EtiquetaProduto) => {
    setProdutosSelecionados((prev) => {
      if (prev.some((p) => p.id === produto.id)) {
        // Remover produto
        const novo = prev.filter((p) => p.id !== produto.id);
        // Remover selecao desse produto
        setSelecoes((s) => {
          const novoS = { ...s };
          delete novoS[produto.id];
          return novoS;
        });
        return novo;
      } else {
        // Adicionar produto
        return [...prev, produto];
      }
    });
  };

  // Handler para seleção de variantes por produto
  const handleSelecionarVariantes = (
    produtoId: number,
    variantes: EtiquetaVariante[]
  ) => {
    setSelecoes((prev) => ({
      ...prev,
      [produtoId]: {
        variantes,
        quantidades:
          prev[produtoId]?.quantidades ||
          Object.fromEntries(variantes.map((v) => [v.id, v.quantity])),
      },
    }));
  };
  // Handler para quantidade por variante
  const handleQuantidadeChange = (
    produtoId: number,
    varianteId: number,
    value: number
  ) => {
    setSelecoes((prev) => ({
      ...prev,
      [produtoId]: {
        ...prev[produtoId],
        quantidades: {
          ...prev[produtoId]?.quantidades,
          [varianteId]: value,
        },
        variantes: prev[produtoId]?.variantes || [],
      },
    }));
  };

  // Preview e impressão: juntar todas as variantes/quantidades dos produtos selecionados
  const allVariantesComQtd = produtosSelecionados.flatMap((produto) => {
    const sel = selecoes[produto.id];
    if (!sel) return [];
    return (sel.variantes || [])
      .filter((v) => (sel.quantidades?.[v.id] ?? v.quantity) > 0)
      .map((v) => ({
        produto,
        variante: v,
        qtd: sel.quantidades?.[v.id] ?? v.quantity,
      }));
  });

  // Handler para seleção de produto na tabela
  const handleSelectProduct = (productRow: any) => {
    // Busca o produto original pelo id
    const found = produtos.find((p) => p.id === productRow.id);
    if (found) handleToggleProduto(found);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-3">
          <Layers className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">Etiquetas</h1>
            <p className="text-sm text-muted-foreground">
              Gerencie as etiquetas de produtos da sua loja
            </p>
          </div>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Configuração de Etiquetas</CardTitle>
          <CardDescription>
            Defina o tamanho e colunas das etiquetas antes de imprimir.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-4 items-end mb-4">
            <div>
              <label className="block text-xs font-semibold mb-1">
                Largura (mm)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={etiquetaWidth}
                onChange={(e) => setEtiquetaWidth(Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Altura (mm)
              </label>
              <input
                type="number"
                min={10}
                max={100}
                value={etiquetaHeight}
                onChange={(e) => setEtiquetaHeight(Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1">
                Colunas
              </label>
              <input
                type="number"
                min={1}
                max={10}
                value={colunas}
                onChange={(e) => setColunas(Number(e.target.value))}
                className="border rounded px-2 py-1 w-20"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Produtos</CardTitle>
          <CardDescription>
            Selecione um ou mais produtos para imprimir etiquetas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtros e busca */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4 items-center">
            <input
              type="search"
              placeholder="Buscar produtos..."
              className="border rounded px-2 py-1 flex-1"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <div>
              <label className="block text-xs font-semibold mb-1">
                Itens por página
              </label>
              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1"
              >
                {[10, 20, 50, 100].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {/* Tabela de produtos com seleção múltipla */}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-8"></TableHead>
                <TableHead>Produto</TableHead>
                <TableHead>Marca</TableHead>
                <TableHead>Estoque</TableHead>
                <TableHead>Preço</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {produtos.map((produto) => (
                <TableRow
                  key={produto.id}
                  className={
                    produtosSelecionados.some((p) => p.id === produto.id)
                      ? 'bg-emerald-50'
                      : ''
                  }
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={produtosSelecionados.some(
                        (p) => p.id === produto.id
                      )}
                      onChange={() => handleToggleProduto(produto)}
                    />
                  </TableCell>
                  <TableCell>{produto.name}</TableCell>
                  <TableCell>{produto.brand}</TableCell>
                  <TableCell>{produto.quantity}</TableCell>
                  <TableCell>
                    R$ {Number(produto.selling_price).toFixed(2)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {/* Paginação */}
          <div className="flex justify-end mt-4 gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <span className="px-2 text-sm">Página {page}</span>
            <Button
              variant="outline"
              size="sm"
              disabled={produtos.length < perPage}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Painel de seleção de variantes/etiquetas para cada produto selecionado */}
      {produtosSelecionados.map((produto) => (
        <Card key={produto.id}>
          <CardHeader>
            <CardTitle>Etiquetas para: {produto.name}</CardTitle>
            <CardDescription>
              Selecione as variantes e quantidades para imprimir etiquetas deste
              produto.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <MultiSelectVariants
              options={
                produto.variants?.map((v) => ({
                  value: v.id,
                  label: v.name,
                })) || []
              }
              value={selecoes[produto.id]?.variantes?.map((v) => v.id) || []}
              onChange={(ids) =>
                handleSelecionarVariantes(
                  produto.id,
                  produto.variants.filter((v) => ids.includes(v.id))
                )
              }
              placeholder="Selecione variantes..."
            />
            {selecoes[produto.id]?.variantes?.length > 0 && (
              <div>
                <div className="font-semibold mb-2">
                  Quantidade de etiquetas por variante:
                </div>
                <table className="min-w-[400px] border rounded-md bg-background">
                  <thead>
                    <tr className="bg-muted">
                      <th className="p-2 text-left">Variante</th>
                      <th className="p-2 text-left">Estoque</th>
                      <th className="p-2 text-left">Qtd. Etiquetas</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selecoes[produto.id]?.variantes.map((variante) => (
                      <tr key={variante.id} className="border-t">
                        <td className="p-2">{variante.name}</td>
                        <td className="p-2">{variante.quantity}</td>
                        <td className="p-2">
                          <input
                            type="number"
                            min={0}
                            max={variante.quantity}
                            value={
                              selecoes[produto.id]?.quantidades?.[
                                variante.id
                              ] ?? variante.quantity
                            }
                            onChange={(e) =>
                              handleQuantidadeChange(
                                produto.id,
                                variante.id,
                                Number(e.target.value)
                              )
                            }
                            className="w-20 border rounded px-2 py-1"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
      {/* Preview e impressão em lote */}
      {allVariantesComQtd.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview e Impressão de Etiquetas</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              ref={printRef}
              className="w-full flex flex-wrap justify-center gap-2"
            >
              {produtosSelecionados.map(
                (produto) =>
                  selecoes[produto.id]?.variantes?.length > 0 && (
                    <EtiquetaPreview
                      key={produto.id}
                      produtos={[produto]}
                      variantes={selecoes[produto.id].variantes.filter(
                        (v) =>
                          (selecoes[produto.id].quantidades?.[v.id] ??
                            v.quantity) > 0
                      )}
                      quantidades={selecoes[produto.id].quantidades}
                      etiquetaWidth={etiquetaWidth}
                      etiquetaHeight={etiquetaHeight}
                    />
                  )
              )}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col items-center gap-4">
            <ImprimirEtiquetasButton
              printRef={printRef as React.RefObject<HTMLDivElement>}
              etiquetaWidth={etiquetaWidth}
              etiquetaHeight={etiquetaHeight}
              colunas={colunas}
            />
          </CardFooter>
        </Card>
      )}
    </motion.div>
  );
};

export default EtiquetasPage;
