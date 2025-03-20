'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, DollarSign, Users, ShoppingBag, Package } from "lucide-react"
import { AdminOrdersTable } from "@/components/admin/admin-orders-table"
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart"
import { PendingShipmentsWidget } from "@/components/admin/pending-shipments-widget"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6 ">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua loja e métricas importantes.</p>
      </div>

      <Tabs defaultValue="hoje" className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="hoje">Hoje</TabsTrigger>
            <TabsTrigger value="semana">Esta Semana</TabsTrigger>
            <TabsTrigger value="mes">Este Mês</TabsTrigger>
            <TabsTrigger value="ano">Este Ano</TabsTrigger>
          </TabsList>
          <Button variant="outline">Exportar Relatório</Button>
        </div>

        <TabsContent value="hoje" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Receita</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 2.350,00</div>
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+12% em relação a ontem</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Pedidos</CardTitle>
                <ShoppingBag className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15</div>
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+5% em relação a ontem</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Novos Clientes</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <div className="flex items-center text-sm text-red-500 mt-1">
                  <ArrowDownRight className="h-4 w-4 mr-1" />
                  <span>-3% em relação a ontem</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Produtos Vendidos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">23</div>
                <div className="flex items-center text-sm text-green-500 mt-1">
                  <ArrowUpRight className="h-4 w-4 mr-1" />
                  <span>+8% em relação a ontem</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Receita</CardTitle>
                <CardDescription>Receita diária ao longo do tempo</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminRevenueChart />
              </CardContent>
            </Card>
            <PendingShipmentsWidget />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Pedidos Recentes</CardTitle>
                <CardDescription>Últimos pedidos realizados na loja</CardDescription>
              </CardHeader>
              <CardContent>
                <AdminOrdersTable />
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Produtos Mais Vendidos</CardTitle>
                <CardDescription>Top 5 produtos por vendas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Blusa de Seda", sales: 12, revenue: 2278.8 },
                    { name: "Calça Alfaiataria", sales: 8, revenue: 2079.2 },
                    { name: "Vestido Midi Plissado", sales: 5, revenue: 1649.5 },
                    { name: "Blazer Estruturado", sales: 4, revenue: 1599.6 },
                    { name: "Lenço de Seda", sales: 3, revenue: 389.7 },
                  ].map((product, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.sales} vendas</p>
                      </div>
                      <p className="font-medium">R$ {product.revenue.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Conteúdo similar para as outras abas (semana, mês, ano) */}
        <TabsContent value="semana" className="space-y-4">
          {/* Conteúdo similar ao da aba "hoje", mas com dados semanais */}
        </TabsContent>
        <TabsContent value="mes" className="space-y-4">
          {/* Conteúdo similar ao da aba "hoje", mas com dados mensais */}
        </TabsContent>
        <TabsContent value="ano" className="space-y-4">
          {/* Conteúdo similar ao da aba "hoje", mas com dados anuais */}
        </TabsContent>
      </Tabs>
    </div>
  )
}

