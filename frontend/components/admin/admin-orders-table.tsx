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

export function AdminOrdersTable() {
  // Normalmente, buscaríamos esses dados do backend
  const pedidos = [
    {
      id: "123456",
      cliente: "Maria Silva",
      data: "15/03/2024",
      valor: 459.9,
      status: "Em processamento",
      pagamento: {
        metodo: "Cartão de crédito",
        status: "Aprovado",
      },
    },
    {
      id: "123455",
      cliente: "João Santos",
      data: "15/03/2024",
      valor: 189.9,
      status: "Aguardando pagamento",
      pagamento: {
        metodo: "Boleto",
        status: "Pendente",
      },
    },
    {
      id: "123454",
      cliente: "Ana Oliveira",
      data: "14/03/2024",
      valor: 329.9,
      status: "Pagamento aprovado",
      pagamento: {
        metodo: "PIX",
        status: "Aprovado",
      },
    },
    {
      id: "123453",
      cliente: "Carlos Pereira",
      data: "14/03/2024",
      valor: 259.9,
      status: "Enviado",
      pagamento: {
        metodo: "Cartão de crédito",
        status: "Aprovado",
      },
    },
    {
      id: "123452",
      cliente: "Fernanda Lima",
      data: "13/03/2024",
      valor: 129.9,
      status: "Cancelado",
      pagamento: {
        metodo: "Cartão de crédito",
        status: "Estornado",
      },
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">#{pedido.id}</TableCell>
              <TableCell>{pedido.cliente}</TableCell>
              <TableCell>{pedido.data}</TableCell>
              <TableCell>R$ {pedido.valor.toFixed(2)}</TableCell>
              <TableCell>
                <Badge className={getStatusColor(pedido.status)}>{pedido.status}</Badge>
              </TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>{pedido.pagamento.metodo}</span>
                  <Badge
                    variant={pedido.pagamento.status === "Aprovado" ? "outline" : "destructive"}
                    className="w-fit mt-1"
                  >
                    {pedido.pagamento.status}
                  </Badge>
                </div>
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

