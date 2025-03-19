"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Link from "next/link"

export function ProductsReportTable() {
  // Normalmente, buscaríamos esses dados do backend
  const produtos = [
    {
      id: "BLS-001",
      nome: "Blusa de Seda",
      quantidade: 32,
      receita: 6076.8,
      percentual: "25.4%",
    },
    {
      id: "CLC-002",
      nome: "Calça Alfaiataria",
      quantidade: 18,
      receita: 4678.2,
      percentual: "14.2%",
    },
    {
      id: "VST-003",
      nome: "Vestido Midi Plissado",
      quantidade: 15,
      receita: 4948.5,
      percentual: "11.9%",
    },
    {
      id: "BLZ-004",
      nome: "Blazer Estruturado",
      quantidade: 12,
      receita: 4798.8,
      percentual: "9.5%",
    },
    {
      id: "LNC-005",
      nome: "Lenço de Seda",
      quantidade: 22,
      receita: 2857.8,
      percentual: "17.5%",
    },
    {
      id: "BLS-006",
      nome: "Bolsa Tote de Couro",
      quantidade: 8,
      receita: 3679.2,
      percentual: "6.3%",
    },
    {
      id: "SND-007",
      nome: "Sandália de Salto",
      quantidade: 10,
      receita: 1999.0,
      percentual: "7.9%",
    },
    {
      id: "CMS-008",
      nome: "Camisa Social",
      quantidade: 9,
      receita: 1619.1,
      percentual: "7.1%",
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produto</TableHead>
            <TableHead className="text-right">Quantidade Vendida</TableHead>
            <TableHead className="text-right">Receita</TableHead>
            <TableHead className="text-right">% do Total</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {produtos.map((produto) => (
            <TableRow key={produto.id}>
              <TableCell>
                <div>
                  <Link href={`/admin/produtos/${produto.id}`} className="font-medium hover:underline">
                    {produto.nome}
                  </Link>
                  <p className="text-xs text-muted-foreground">#{produto.id}</p>
                </div>
              </TableCell>
              <TableCell className="text-right">{produto.quantidade}</TableCell>
              <TableCell className="text-right">R$ {produto.receita.toFixed(2)}</TableCell>
              <TableCell className="text-right">{produto.percentual}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

