import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"
import { AdminOrdersTable } from "@/components/admin/admin-orders-table"


export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos</h1>
          <p className="text-muted-foreground">Gerencie e acompanhe todos os pedidos da loja.</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar pedidos..." className="pl-8 w-[250px]" />
          </div>
          <Button variant="outline">Exportar</Button>
        </div>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="aguardando">Aguardando Pagamento</TabsTrigger>
          <TabsTrigger value="aprovados">Pagamento Aprovado</TabsTrigger>
          <TabsTrigger value="processando">Em Processamento</TabsTrigger>
          <TabsTrigger value="enviados">Enviados</TabsTrigger>
          <TabsTrigger value="entregues">Entregues</TabsTrigger>
          <TabsTrigger value="cancelados">Cancelados</TabsTrigger>
        </TabsList>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminOrdersTable />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Conteúdo similar para as outras abas */}
        <TabsContent value="aguardando">
          <Card>
            <CardHeader>
              <CardTitle>Aguardando Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              </CardContent>
          </Card>
        </TabsContent>

        {/* Outras abas seguem o mesmo padrão */}
      </Tabs>
    </div>
  )
}

