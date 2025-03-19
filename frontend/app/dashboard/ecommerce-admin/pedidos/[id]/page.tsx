"use client";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Package, CheckCircle, Printer } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { TrackingManager } from "@/components/admin/tracking-manager"


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

export default function AdminOrderDetailPage() {
  const params = useParams();
  
  // Normalmente, buscaríamos esses dados do backend com base no ID
  const pedido = {
    id: params.id,
    cliente: {
      nome: "Maria Silva",
      email: "maria.silva@exemplo.com",
      telefone: "(11) 98765-4321",
    },
    data: "15/03/2024",
    valor: 459.9,
    status: "Em processamento",
    pagamento: {
      metodo: "Cartão de crédito",
      status: "Aprovado",
      ultimos4Digitos: "4242",
      parcelas: 3,
      valorParcela: 153.3,
      dataAprovacao: "15/03/2024 14:35",
      idTransacao: "txn_123456789",
    },
    envio: {
      metodo: "Sedex",
      valor: 25.0,
      prazo: "3-5 dias úteis",
      endereco: {
        destinatario: "Maria Silva",
        rua: "Rua das Flores, 123",
        bairro: "Jardim Primavera",
        cidade: "São Paulo",
        estado: "SP",
        cep: "01234-567",
      },
      rastreamento: "BR123456789BR",
    },
    itens: [
      {
        id: 1,
        nome: "Blusa de Seda AZUL P",
        cor: "AZUL",
        tamanho: "P",
        quantidade: 1,
        preco: 189.9,
        imagem: "https://res.cloudinary.com/delwujvnn/image/upload/v1741727764/miohghq0nvw9sds1uk41.jpg",
      },
      {
        id: 2,
        nome: "Calça Alfaiataria PRETO 38",
        cor: "PRETO",
        tamanho: "38",
        quantidade: 1,
        preco: 259.9,
        imagem: "/placeholder.svg?height=800&width=600",
      },
    ],
    timeline: [
      {
        data: "15/03/2024 14:30",
        status: "Pedido realizado",
        descricao: "Pedido recebido com sucesso.",
        icone: Package,
      },
      {
        data: "15/03/2024 14:35",
        status: "Pagamento aprovado",
        descricao: "O pagamento do pedido foi aprovado.",
        icone: CheckCircle,
      },
      {
        data: "15/03/2024 16:20",
        status: "Em processamento",
        descricao: "Pedido está sendo preparado para envio.",
        icone: Package,
        atual: true,
      },
    ],
    notas: [
      {
        data: "15/03/2024 14:40",
        autor: "Sistema",
        texto: "Pagamento aprovado automaticamente pelo gateway.",
      },
      {
        data: "15/03/2024 16:20",
        autor: "João (Atendente)",
        texto:
          "Cliente solicitou entrega prioritária. Já informado que não é possível alterar o método de envio após a confirmação do pedido.",
      },
    ],
  }

  const subtotal = pedido.itens.reduce((total, item) => total + item.preco * item.quantidade, 0)

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <Link
            href="/admin/pedidos"
            className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Voltar para pedidos
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">Pedido #{pedido.id}</h1>
          <p className="text-muted-foreground">
            Realizado em {pedido.data} por {pedido.cliente.nome}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex items-center gap-1">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button>Atualizar Status</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Status do Pedido</CardTitle>
              <Badge className={`${getStatusColor(pedido.status)} text-base px-3 py-1`}>{pedido.status}</Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Select defaultValue={pedido.status}>
                      <SelectTrigger className="w-[200px]">
                        <SelectValue placeholder="Selecione o status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Aguardando pagamento">Aguardando pagamento</SelectItem>
                        <SelectItem value="Pagamento aprovado">Pagamento aprovado</SelectItem>
                        <SelectItem value="Em processamento">Em processamento</SelectItem>
                        <SelectItem value="Enviado">Enviado</SelectItem>
                        <SelectItem value="Entregue">Entregue</SelectItem>
                        <SelectItem value="Cancelado">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button>Salvar</Button>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Última atualização: {pedido.timeline[pedido.timeline.length - 1].data}
                  </div>
                </div>

                <Separator />

                <div className="relative">
                  {pedido.timeline.map((evento, index) => (
                    <div key={index} className="flex mb-6 last:mb-0">
                      <div className="flex flex-col items-center mr-4">
                        <div
                          className={`rounded-full p-2 ${evento.atual ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                        >
                          <evento.icone className="h-5 w-5" />
                        </div>
                        {index < pedido.timeline.length - 1 && <div className="w-px h-full bg-muted mt-2"></div>}
                      </div>
                      <div>
                        <p className="font-medium">{evento.status}</p>
                        <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                        <p className="text-xs text-muted-foreground mt-1">{evento.data}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <TrackingManager
            pedidoId={pedido.id}
            rastreamento={pedido.envio.rastreamento}
            metodoEnvio={pedido.envio.metodo}
            status={pedido.status}
          />

          <Tabs defaultValue="itens">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="itens">Itens do Pedido</TabsTrigger>
              <TabsTrigger value="notas">Notas</TabsTrigger>
              <TabsTrigger value="historico">Histórico</TabsTrigger>
            </TabsList>
            <TabsContent value="itens" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {pedido.itens.map((item) => (
                      <div key={item.id} className="flex items-start space-x-4 py-4 border-b last:border-0 last:pb-0">
                        <div className="relative h-20 w-20 overflow-hidden rounded-md border">
                          <Image
                            src={item.imagem || "/placeholder.svg"}
                            alt={item.nome}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>
                        <div className="flex-1 space-y-1">
                          <h4 className="font-medium">{item.nome}</h4>
                          <div className="flex space-x-4 text-sm text-muted-foreground">
                            <p>Cor: {item.cor}</p>
                            <p>Tamanho: {item.tamanho}</p>
                          </div>
                          <div className="flex justify-between text-sm">
                            <p>Qtd: {item.quantidade}</p>
                            <p className="font-medium">R$ {item.preco.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="notas" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {pedido.notas.map((nota, index) => (
                      <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex justify-between items-start mb-2">
                          <p className="font-medium">{nota.autor}</p>
                          <p className="text-xs text-muted-foreground">{nota.data}</p>
                        </div>
                        <p className="text-sm">{nota.texto}</p>
                      </div>
                    ))}
                    <Separator />
                    <div className="space-y-2">
                      <h4 className="font-medium">Adicionar Nota</h4>
                      <Textarea placeholder="Digite uma nota sobre este pedido..." />
                      <Button className="w-full">Adicionar Nota</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="historico" className="mt-4">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {/* Histórico de alterações do pedido */}
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Status alterado</p>
                        <p className="text-xs text-muted-foreground">15/03/2024 16:20</p>
                      </div>
                      <p className="text-sm">
                        Status alterado de "Pagamento aprovado" para "Em processamento" por Sistema
                      </p>
                    </div>
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Pagamento</p>
                        <p className="text-xs text-muted-foreground">15/03/2024 14:35</p>
                      </div>
                      <p className="text-sm">Pagamento aprovado (ID da transação: {pedido.pagamento.idTransacao})</p>
                    </div>
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Pedido criado</p>
                        <p className="text-xs text-muted-foreground">15/03/2024 14:30</p>
                      </div>
                      <p className="text-sm">
                        Pedido #{pedido.id} criado por {pedido.cliente.nome}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Frete</span>
                  <span>R$ {pedido.envio.valor.toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <span>R$ {pedido.valor.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cliente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="font-medium">{pedido.cliente.nome}</p>
                <p className="text-sm">{pedido.cliente.email}</p>
                <p className="text-sm">{pedido.cliente.telefone}</p>
                <div className="pt-2">
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Perfil do Cliente
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método</span>
                  <span>{pedido.pagamento.metodo}</span>
                </div>
                {pedido.pagamento.ultimos4Digitos && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cartão</span>
                    <span>**** {pedido.pagamento.ultimos4Digitos}</span>
                  </div>
                )}
                {pedido.pagamento.parcelas > 1 && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Parcelas</span>
                      <span>
                        {pedido.pagamento.parcelas}x de R$ {pedido.pagamento.valorParcela.toFixed(2)}
                      </span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <Badge variant={pedido.pagamento.status === "Aprovado" ? "default" : "destructive"}>
                    {pedido.pagamento.status}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ID da Transação</span>
                  <span className="text-xs">{pedido.pagamento.idTransacao}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço de Entrega</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p className="font-medium">{pedido.envio.endereco.destinatario}</p>
                <p className="text-sm">{pedido.envio.endereco.rua}</p>
                <p className="text-sm">{pedido.envio.endereco.bairro}</p>
                <p className="text-sm">
                  {pedido.envio.endereco.cidade}, {pedido.envio.endereco.estado}
                </p>
                <p className="text-sm">{pedido.envio.endereco.cep}</p>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Método de envio</span>
                  <span>{pedido.envio.metodo}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-muted-foreground">Prazo estimado</span>
                  <span>{pedido.envio.prazo}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

