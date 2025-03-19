import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { AdminShipmentsTable } from "@/components/admin/admin-shipments-table"

export default function AdminShipmentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gerenciamento de Envios</h1>
          <p className="text-muted-foreground">
            Gerencie códigos de rastreio e atualize o status de envio dos pedidos.
          </p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Buscar pedidos..." className="pl-8 w-[250px]" />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>
      </div>

      <Tabs defaultValue="pendentes" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pendentes">Pendentes de Envio</TabsTrigger>
          <TabsTrigger value="enviados">Enviados</TabsTrigger>
          <TabsTrigger value="entregues">Entregues</TabsTrigger>
          <TabsTrigger value="todos">Todos</TabsTrigger>
        </TabsList>

        <TabsContent value="pendentes">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Pendentes de Envio</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminShipmentsTable status="pendente" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enviados">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Enviados</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminShipmentsTable status="enviado" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="entregues">
          <Card>
            <CardHeader>
              <CardTitle>Pedidos Entregues</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminShipmentsTable status="entregue" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="todos">
          <Card>
            <CardHeader>
              <CardTitle>Todos os Pedidos</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminShipmentsTable status="todos" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

