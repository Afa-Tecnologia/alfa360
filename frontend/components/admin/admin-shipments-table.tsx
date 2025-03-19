"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Truck, Send, CheckCircle, AlertTriangle } from "lucide-react"
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

interface AdminShipmentsTableProps {
  status: "pendente" | "enviado" | "entregue" | "todos"
}

export function AdminShipmentsTable({ status }: AdminShipmentsTableProps) {
  const [openDialog, setOpenDialog] = useState<string | null>(null)
  const [trackingCode, setTrackingCode] = useState("")
  const [shippingMethod, setShippingMethod] = useState("sedex")

  // Normalmente, buscaríamos esses dados do backend
  const pedidos = [
    {
      id: "123456",
      cliente: "Maria Silva",
      data: "15/03/2024",
      valor: 459.9,
      status: "Em processamento",
      pagamento: {
        status: "Aprovado",
      },
      envio: {
        metodo: "Sedex",
        rastreamento: "",
        status: "pendente",
      },
      itens: [
        { nome: "Blusa de Seda AZUL P", quantidade: 1 },
        { nome: "Calça Alfaiataria PRETO 38", quantidade: 1 },
      ],
    },
    {
      id: "123455",
      cliente: "João Santos",
      data: "15/03/2024",
      valor: 189.9,
      status: "Pagamento aprovado",
      pagamento: {
        status: "Aprovado",
      },
      envio: {
        metodo: "PAC",
        rastreamento: "",
        status: "pendente",
      },
      itens: [{ nome: "Vestido Midi Plissado VERDE M", quantidade: 1 }],
    },
    {
      id: "123454",
      cliente: "Ana Oliveira",
      data: "14/03/2024",
      valor: 329.9,
      status: "Enviado",
      pagamento: {
        status: "Aprovado",
      },
      envio: {
        metodo: "Sedex",
        rastreamento: "BR123456789BR",
        status: "enviado",
        dataEnvio: "16/03/2024",
      },
      itens: [{ nome: "Blazer Estruturado PRETO 40", quantidade: 1 }],
    },
    {
      id: "123453",
      cliente: "Carlos Pereira",
      data: "14/03/2024",
      valor: 259.9,
      status: "Entregue",
      pagamento: {
        status: "Aprovado",
      },
      envio: {
        metodo: "Sedex",
        rastreamento: "BR987654321BR",
        status: "entregue",
        dataEnvio: "15/03/2024",
        dataEntrega: "17/03/2024",
      },
      itens: [
        { nome: "Lenço de Seda ESTAMPADO", quantidade: 1 },
        { nome: "Blusa de Seda BRANCO M", quantidade: 1 },
      ],
    },
  ].filter((pedido) => {
    if (status === "todos") return true
    return pedido.envio.status === status
  })

  const handleAddTracking = (pedidoId: string) => {
    console.log(`Adicionando código de rastreio ${trackingCode} para o pedido ${pedidoId}`)
    // Aqui você faria uma chamada para a API para atualizar o código de rastreio
    setOpenDialog(null)
    setTrackingCode("")
  }

  const handleUpdateStatus = (pedidoId: string, novoStatus: string) => {
    console.log(`Atualizando status do pedido ${pedidoId} para ${novoStatus}`)
    // Aqui você faria uma chamada para a API para atualizar o status
  }

  const handleSendNotification = (pedidoId: string) => {
    console.log(`Enviando notificação para o cliente sobre o pedido ${pedidoId}`)
    // Aqui você faria uma chamada para a API para enviar a notificação
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Pedido</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Itens</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rastreio</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pedidos.map((pedido) => (
            <TableRow key={pedido.id}>
              <TableCell className="font-medium">#{pedido.id}</TableCell>
              <TableCell>{pedido.cliente}</TableCell>
              <TableCell>{pedido.data}</TableCell>
              <TableCell>
                <div className="max-w-[200px] truncate">
                  {pedido.itens.map((item) => `${item.quantidade}x ${item.nome}`).join(", ")}
                </div>
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(pedido.status)}>{pedido.status}</Badge>
              </TableCell>
              <TableCell>
                {pedido.envio.rastreamento ? (
                  <div className="flex flex-col">
                    <span className="text-sm">{pedido.envio.rastreamento}</span>
                    <span className="text-xs text-muted-foreground">{pedido.envio.metodo}</span>
                  </div>
                ) : (
                  <Badge variant="outline" className="text-yellow-500 border-yellow-500">
                    Pendente
                  </Badge>
                )}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {pedido.envio.status === "pendente" && (
                    <Dialog
                      open={openDialog === pedido.id}
                      onOpenChange={(open) => setOpenDialog(open ? pedido.id : null)}
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8">
                          <Truck className="h-4 w-4 mr-1" />
                          Adicionar Rastreio
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Adicionar Código de Rastreio</DialogTitle>
                          <DialogDescription>
                            Adicione o código de rastreio para o pedido #{pedido.id}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <label htmlFor="shipping-method" className="text-sm font-medium">
                              Método de Envio
                            </label>
                            <Select value={shippingMethod} onValueChange={setShippingMethod}>
                              <SelectTrigger id="shipping-method">
                                <SelectValue placeholder="Selecione o método de envio" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="sedex">Sedex</SelectItem>
                                <SelectItem value="pac">PAC</SelectItem>
                                <SelectItem value="transportadora">Transportadora</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="tracking-code" className="text-sm font-medium">
                              Código de Rastreio
                            </label>
                            <Input
                              id="tracking-code"
                              value={trackingCode}
                              onChange={(e) => setTrackingCode(e.target.value)}
                              placeholder="Digite o código de rastreio"
                            />
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" onClick={() => setOpenDialog(null)}>
                            Cancelar
                          </Button>
                          <Button onClick={() => handleAddTracking(pedido.id)} disabled={!trackingCode.trim()}>
                            Salvar e Atualizar Status
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  )}

                  {pedido.envio.status === "enviado" && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleUpdateStatus(pedido.id, "entregue")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Marcar como Entregue
                    </Button>
                  )}

                  {pedido.envio.rastreamento && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-8"
                      onClick={() => handleSendNotification(pedido.id)}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Notificar Cliente
                    </Button>
                  )}

                  <Link href={`/admin/pedidos/${pedido.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">Ver detalhes</span>
                    </Button>
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {pedidos.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-6">
                <div className="flex flex-col items-center justify-center text-muted-foreground">
                  <AlertTriangle className="h-10 w-10 mb-2" />
                  <p>Nenhum pedido encontrado nesta categoria.</p>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

