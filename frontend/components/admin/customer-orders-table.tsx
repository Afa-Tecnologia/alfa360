"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import Link from "next/link"

// Função para obter a cor do status do pedido
function getStatusColor(status: string) {
  switch (status) {
    case "Aguardando pagamento":
      return "bg-yellow-500"
    case "Pagamento aprovado":
      return "bg-green-500"
    case "Em processamento":
      return "bg-blue-500"
    case "Enviado":
      return "bg-purple-500"
    case "Entregue":
      return "bg-green-700"
    case "Cancelado":
      return "bg-red-500"
    default:
      return "bg-gray-500"
  }
}

interface CustomerOrdersTableProps {
  pedidos: Array<{
    id: string
    data: string
    valor: number
    status: string
    itens: number
  }>
}

export function CustomerOrdersTable({ pedidos }: CustomerOrdersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">#{pedido.id}</TableCell>
              <TableCell>{pedido.data}</TableCell>
              <TableCell>R$ {pedido.valor.toFixed(2)}</TableCell>
              <TableCell>{pedido.itens}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(pedido.status)}>{pedido.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/admin/pedidos/${pedido.id}`}>
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                    <span className="sr-only">Ver detalhes</span>
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

