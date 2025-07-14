'use client';

import { useEffect, useRef, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2, X } from 'lucide-react';
import { VariantImageUploader } from './variant-image-uploader';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import productService from '@/services/productService';
import { AtributoTipoDeNegocio, ResponseAtributos } from '@/types/product';

export interface VariantFormValues {
  id?: number | string;
  name: string;
  atributos: {
    atributo_id: string | number;
    valor: string;
    name?: string;
    pivot?: {
      valor: string;
      atributo_id: string;
      variante_id: string;
    };
  }[];
  quantity: string | number;
  images: string[];
  type?: string;
}

interface VariantFormProps {
  variant: VariantFormValues;
  index: number;
  onUpdate: (index: number, field: keyof VariantFormValues, value: any) => void;
  onRemove: (index: number) => void;
  onUpdateImages: (index: number, images: string[]) => void;
  productName: string;
}

export function VariantForm({
  variant,
  index,
  onUpdate,
  onRemove,
  onUpdateImages,
  productName,
}: VariantFormProps) {
  const [atributosDisponiveis, setAtributosDisponiveis] = useState<any[]>([]);
  const [attrDiv, setattrDiv] = useState<
    { atributo_id: string | number; valor: string }[]
  >([]);
  const prevNomeRef = useRef('');

  // Função para comparar arrays de atributos (para evitar resets desnecessários)
  function isEqual(a1: any[], a2: any[]) {
    if (a1.length !== a2.length) return false;
    for (let i = 0; i < a1.length; i++) {
      if (a1[i].atributo_id !== a2[i].atributo_id || a1[i].valor !== a2[i].valor) {
        return false;
      }
    }
    return true;
  }

  // Carrega atributos e estrutura inicial do variant.atributos
  useEffect(() => {
    const parsed = Array.isArray(variant.atributos)
      ? variant.atributos.map((attr) => ({
          atributo_id: attr.atributo_id || attr.pivot?.atributo_id || '',
          valor: attr.valor || attr.pivot?.valor || '',
        }))
      : [];

    if (!isEqual(attrDiv, parsed)) {
      setattrDiv(parsed);
    }

    const fetchAtributos = async () => {
       const responseAtributos = (await productService.getAtributosVarianteByBusiness()) as unknown as {
    atributos: AtributoTipoDeNegocio[];
  };
      console.log('responseAtributos:', responseAtributos);

  const allAtributos = responseAtributos.atributos || [];
  setAtributosDisponiveis(allAtributos);


    };

    fetchAtributos();
  }, [variant.atributos]);

  // Preenche automaticamente um atributo vazio ao iniciar, caso não exista nenhum
  useEffect(() => {
    if (
      variant.atributos.length === 0 &&
      attrDiv.length === 0 &&
      atributosDisponiveis.length > 0
    ) {
      const atributoInicial = {
        atributo_id: atributosDisponiveis[0].id.toString(),
        valor: '',
      };
      setattrDiv([atributoInicial]);
      onUpdate(index, 'atributos', [atributoInicial]);
    }
  }, [atributosDisponiveis]);

  // Atualiza o nome automaticamente com base nos atributos
  useEffect(() => {
    const nomeGerado = `${productName} ${attrDiv.map((a) => a.valor).join(' ')}`.trim();
    if (nomeGerado !== prevNomeRef.current) {
      prevNomeRef.current = nomeGerado;
      onUpdate(index, 'name', nomeGerado);
    }
  }, [attrDiv, productName]);

  // Atualiza um atributo no array local e avisa o pai SEM FILTRAR
  const handleUpdateAtributo = (
    attrIndex: number,
    field: 'atributo_id' | 'valor',
    value: string
  ) => {
    const atualizados = [...attrDiv];
    if (!atualizados[attrIndex]) return;

    atualizados[attrIndex] = {
      ...atualizados[attrIndex],
      [field]: value,
    };

    setattrDiv(atualizados);

    // Envia todos, inclusive incompletos, para o pai manter estado consistente
    onUpdate(index, 'atributos', atualizados);
  };

  // Adiciona um novo atributo padrão e atualiza o pai
  const handleAddAtributo = () => {
    const primeiroAtributoId = atributosDisponiveis[0]?.id?.toString() || '';
    const novos = [...attrDiv, { atributo_id: primeiroAtributoId, valor: '' }];
    setattrDiv(novos);
    onUpdate(index, 'atributos', novos);
  };

  // Remove atributo e atualiza o pai
  const handleRemoveAtributo = (attrIndex: number) => {
    const novos = [...attrDiv];
    novos.splice(attrIndex, 1);
    setattrDiv(novos);
    onUpdate(index, 'atributos', novos);
  };

  return (
    <div className="border rounded-md p-4 relative">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 h-6 w-6"
        onClick={() => onRemove(index)}
      >
        <X className="h-4 w-4" />
      </Button>

      <h4 className="font-medium mb-3">Variante {index + 1}</h4>

      <div className="space-y-3">
        <div className="grid grid-cols-1 gap-3">
          <div>
            <label className="text-sm font-medium">Nome</label>
            <Input
              value={variant.name}
              readOnly
              disabled
              className="bg-muted"
              placeholder="Nome gerado automaticamente"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Gerado automaticamente a partir dos atributos e nome do produto
            </p>
          </div>
        </div>

        <div className="space-y-2">
          {attrDiv.map((item, attrIndex) => (
            <div
              key={attrIndex}
              className="grid grid-cols-1 md:grid-cols-3 gap-3"
            >
              <div>
                <label className="text-sm font-medium">Atributo</label>
                <Select
                  value={item.atributo_id?.toString() || ''}
                  onValueChange={(value) =>
                    handleUpdateAtributo(attrIndex, 'atributo_id', value)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Escolha o atributo" />
                  </SelectTrigger>
                  <SelectContent>
                    {atributosDisponiveis.map((attr) => (
                      <SelectItem key={attr.id} value={attr.id.toString()}>
                        {attr.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Valor</label>
                <Input
                  value={item.valor || ''}
                  onChange={(e) =>
                    handleUpdateAtributo(attrIndex, 'valor', e.target.value.toUpperCase())
                  }
                  placeholder="Valor"
                  className="uppercase h-9"
                />
              </div>

              <div className="flex items-end">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveAtributo(attrIndex)}
                >
                  <Trash2 className="h-4 w-4 text-red-500" />
                </Button>
              </div>
            </div>
          ))}

          <Button
            type="button"
            variant="link"
            onClick={handleAddAtributo}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar Atributo
          </Button>
        </div>

        <div>
          <label className="text-sm font-medium">Estoque</label>
          <Input
            type="number"
            value={variant.quantity}
            onChange={(e) => onUpdate(index, 'quantity', e.target.value)}
            placeholder="Quantidade"
            min="0"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Imagens</label>
          <VariantImageUploader
            initialImages={variant.images || []}
            onChange={(urls) => onUpdateImages(index, urls)}
          />
        </div>
      </div>
    </div>
  );
}
