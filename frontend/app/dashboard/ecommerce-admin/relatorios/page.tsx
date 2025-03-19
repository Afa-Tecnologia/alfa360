import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Calendar } from "lucide-react"
import { SalesReportChart } from "@/components/admin/sales-report-chart"
import { ProductsReportTable } from "@/components/admin/products-report-table"
import { CustomersReportChart } from "@/components/admin/customers-report-chart"

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Relatórios</h1>
          <p className="text-muted-foreground">Analise o desempenho da sua loja com relatórios detalhados.</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Select defaultValue="ultimo-mes">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Selecione o período" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="hoje">Hoje</SelectItem>
                <SelectItem value="ontem">Ontem</SelectItem>
                <SelectItem value="ultima-semana">Última Semana</SelectItem>
                <SelectItem value="ultimo-mes">Último Mês</SelectItem>
                <SelectItem value="ultimo-trimestre">Último Trimestre</SelectItem>
                <SelectItem value="ultimo-ano">Último Ano</SelectItem>
                <SelectItem value="personalizado">Personalizado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      <Tabs defaultValue="vendas" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="vendas">Vendas</TabsTrigger>
          <TabsTrigger value="produtos">Produtos</TabsTrigger>
          <TabsTrigger value="clientes">Clientes</TabsTrigger>
        </TabsList>

        <TabsContent value="vendas" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Total de Vendas</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 12.580,90</div>
                <p className="text-xs text-green-500 mt-1">+12% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Número de Pedidos</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">45</div>
                <p className="text-xs text-green-500 mt-1">+8% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Ticket Médio</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 279,58</div>
                <p className="text-xs text-green-500 mt-1">+4% em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Vendas por Período</CardTitle>
              <CardDescription>Evolução das vendas nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesReportChart />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Método de Pagamento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Cartão de Crédito</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "65%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 8.177,59</p>
                      <p className="text-xs text-muted-foreground">65%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">PIX</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "25%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 3.145,23</p>
                      <p className="text-xs text-muted-foreground">25%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Boleto</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 1.258,09</p>
                      <p className="text-xs text-muted-foreground">10%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Vendas por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Roupas</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "70%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 8.806,63</p>
                      <p className="text-xs text-muted-foreground">70%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Acessórios</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 2.516,18</p>
                      <p className="text-xs text-muted-foreground">20%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Calçados</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "10%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">R$ 1.258,09</p>
                      <p className="text-xs text-muted-foreground">10%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="produtos" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Produtos Vendidos</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">120</div>
                <p className="text-xs text-green-500 mt-1">+15% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Produtos Mais Vendidos</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Blusa de Seda</div>
                <p className="text-xs text-muted-foreground mt-1">32 unidades vendidas</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Taxa de Conversão</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">3.2%</div>
                <p className="text-xs text-green-500 mt-1">+0.5% em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Produtos Mais Vendidos</CardTitle>
              <CardDescription>Top 10 produtos por quantidade vendida</CardDescription>
            </CardHeader>
            <CardContent>
              <ProductsReportTable />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="clientes" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Novos Clientes</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">28</div>
                <p className="text-xs text-green-500 mt-1">+12% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Taxa de Retenção</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">65%</div>
                <p className="text-xs text-green-500 mt-1">+5% em relação ao mês anterior</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Valor Médio por Cliente</CardTitle>
                <CardDescription>Último mês</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 450,00</div>
                <p className="text-xs text-green-500 mt-1">+8% em relação ao mês anterior</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Aquisição de Clientes</CardTitle>
              <CardDescription>Novos clientes nos últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <CustomersReportChart />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Clientes por Região</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Sudeste</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "60%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">120</p>
                      <p className="text-xs text-muted-foreground">60%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Sul</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "20%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">40</p>
                      <p className="text-xs text-muted-foreground">20%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Nordeste</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">30</p>
                      <p className="text-xs text-muted-foreground">15%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">Centro-Oeste</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "5%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">10</p>
                      <p className="text-xs text-muted-foreground">5%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Clientes por Faixa Etária</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">18-24 anos</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">30</p>
                      <p className="text-xs text-muted-foreground">15%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">25-34 anos</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "40%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">80</p>
                      <p className="text-xs text-muted-foreground">40%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">35-44 anos</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "30%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">60</p>
                      <p className="text-xs text-muted-foreground">30%</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-medium">45+ anos</p>
                      <div className="w-full bg-muted rounded-full h-2 mt-1">
                        <div className="bg-primary rounded-full h-2" style={{ width: "15%" }}></div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">30</p>
                      <p className="text-xs text-muted-foreground">15%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

