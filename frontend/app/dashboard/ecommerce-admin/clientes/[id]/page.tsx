"use client";
import { useParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Mail, Phone, Calendar, MapPin, ShoppingBag, CreditCard, User } from "lucide-react"
import Link from "next/link"
import { CustomerOrdersTable } from "@/components/admin/customer-orders-table"

export default function CustomerDetailPage() {
  const params = useParams()
  
  const cliente = {
    id: params.id,
    nome: "Maria Silva",
    email: "maria.silva@exemplo.com",
    telefone: "(11) 98765-4321",
    dataCadastro: "15/01/2024",
    ultimoLogin: "15/03/2024",
    totalPedidos: 8,
    valorGasto: 2350.5,
    status: "Ativo",
    endereco: {
      rua: "Rua das Flores, 123",
      bairro: "Jardim Primavera",
      cidade: "São Paulo",
      estado: "SP",
      cep: "01234-567",
    },
    pedidos: [
      {
        id: "123456",
        data: "15/03/2024",
        valor: 459.9,
        status: "Em processamento",
        itens: 2,
      },
      {
        id: "123455",
        data: "28/02/2024",
        valor: 129.9,
        status: "Enviado",
        itens: 1,
      },
      {
        id: "123454",
        data: "15/02/2024",
        valor: 259.8,
        status: "Entregue",
        itens: 2,
      },
    ],
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/clientes"
          className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar para clientes
        </Link>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{cliente.nome}</h1>
            <p className="text-muted-foreground">Cliente desde {cliente.dataCadastro}</p>
          </div>
          <Badge variant="outline" className="text-green-500 border-green-500 md:self-start">
            {cliente.status}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email</p>
                      <p>{cliente.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p>{cliente.telefone}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Data de Cadastro</p>
                      <p>{cliente.dataCadastro}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Último Login</p>
                      <p>{cliente.ultimoLogin}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Endereço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground mt-1" />
                <div>
                  <p>{cliente.endereco.rua}</p>
                  <p>{cliente.endereco.bairro}</p>
                  <p>
                    {cliente.endereco.cidade}, {cliente.endereco.estado}
                  </p>
                  <p>{cliente.endereco.cep}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="pedidos">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="pedidos">Pedidos</TabsTrigger>
              <TabsTrigger value="atividade">Atividade</TabsTrigger>
            </TabsList>
            <TabsContent value="pedidos" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Histórico de Pedidos</CardTitle>
                </CardHeader>
                <CardContent>
                  <CustomerOrdersTable pedidos={cliente.pedidos} />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="atividade" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Login realizado</p>
                        <p className="text-xs text-muted-foreground">15/03/2024 14:30</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Cliente fez login na loja</p>
                    </div>
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Pedido realizado</p>
                        <p className="text-xs text-muted-foreground">15/03/2024 14:35</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Cliente realizou o pedido #123456</p>
                    </div>
                    <div className="border-b pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-medium">Produto adicionado aos favoritos</p>
                        <p className="text-xs text-muted-foreground">14/03/2024 10:15</p>
                      </div>
                      <p className="text-sm text-muted-foreground">Cliente adicionou "Blusa de Seda" aos favoritos</p>
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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Total de Pedidos</span>
                  </div>
                  <span className="font-medium">{cliente.totalPedidos}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Valor Total Gasto</span>
                  </div>
                  <span className="font-medium">R$ {cliente.valorGasto.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Ticket Médio</span>
                  <span className="font-medium">R$ {(cliente.valorGasto / cliente.totalPedidos).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Mail className="h-4 w-4 mr-2" />
                Enviar E-mail
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <ShoppingBag className="h-4 w-4 mr-2" />
                Criar Novo Pedido
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

