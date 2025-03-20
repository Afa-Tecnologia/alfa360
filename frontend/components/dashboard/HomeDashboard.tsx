import { ShoppingBag, Package, Users, BookOpen, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function WelcomeScreenDashboard() {
  // Obter hora atual para saudação personalizada
  const hora = new Date().getHours()
  let saudacao = "Bom dia"

  if (hora >= 12 && hora < 18) {
    saudacao = "Boa tarde"
  } else if (hora >= 18 || hora < 5) {
    saudacao = "Boa noite"
  }

  // Obter data atual formatada em português
  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // Primeira letra maiúscula
  const dataFormatada = dataAtual.charAt(0).toUpperCase() + dataAtual.slice(1)

  return (
    <div className="min-h-screen bg-white">
    
      {/* Main Content */}
      <main className="p-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Bem-vindo ao LesAmis</h1>
          <p className="text-muted-foreground mt-2">
            {saudacao}! Hoje é {dataFormatada}
          </p>
        </div>

        {/* Welcome Card */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-none">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1">
                <h2 className="text-2xl font-bold mb-2">Olá, Usuário!</h2>
                <p className="text-muted-foreground mb-4">
                  Bem-vindo de volta ao sistema LesAmis. Aqui você pode gerenciar sua loja, acompanhar vendas e muito
                  mais. O que você gostaria de fazer hoje?
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    <Link href={'/dashboard/vendas'}>
                    Nova Venda
                    </Link>
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Package className="h-4 w-4" />
                    <Link href={'/dashboard/estoque'}>
                    Gerenciar Produtos
                    </Link>
                  </Button>
                  <Button variant="outline" className="gap-2">
                    <Users className="h-4 w-4" />
                    <Link href={'/dashboard/ecommerce-admin/clientes'}>
                    Ver Clientes
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex-shrink-0 w-48 h-48 rounded-full bg-blue-100 flex items-center justify-center">
                <img
                  src="/placeholder.svg?height=192&width=192"
                  alt="Ilustração de boas-vindas"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Cards */}
        <h2 className="text-xl font-semibold mb-4">Acesso Rápido</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-blue-500" />
                Vendas
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="mb-3">
                Registre novas vendas e gerencie transações existentes.
              </CardDescription>
              <Button variant="outline" size="sm" className="w-full  mt-auto">
              <Link href={'/dashboard/vendas'}>
                Acessar
              </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Package className="h-5 w-5 text-green-500" />
                Produtos
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="mb-3">Gerencie seu catálogo de produtos e estoque.</CardDescription>
              <Button variant="outline" size="sm" className="w-full  mt-auto">
              <Link href={'/dashboard/ecommerce-admin/produtos'}>
                Acessar
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-amber-500" />
                Clientes
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="mb-3">Visualize e gerencie sua base de clientes.</CardDescription>
              <Button variant="outline" size="sm" className="w-full  mt-auto">
              <Link href={'/dashboard/ecommerce-admin/clientes'}>
                Acessar
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="flex flex-col h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-purple-500" />
                Relatórios
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <CardDescription className="mb-3">Acesse relatórios e análises de desempenho.</CardDescription>
              <Button variant="outline" size="sm" className="w-full  mt-auto">
                <Link href={'/dashboard/ecommerce-admin/relatorios'}>
                  Acessar
                </Link>
              
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity Section */}
        <h2 className="text-xl font-semibold mt-8 mb-4">Atividades Recentes</h2>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y">
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-blue-500" />
                  </div>
                  <div>
                    <p className="font-medium">Nova venda realizada</p>
                    <p className="text-sm text-muted-foreground">Venda #12345 - R$ 157,90</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Hoje, 10:45</div>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                    <Package className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="font-medium">Produto adicionado ao estoque</p>
                    <p className="text-sm text-muted-foreground">Camiseta Verão - 25 unidades</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Ontem, 15:30</div>
              </div>

              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-amber-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">Novo cliente cadastrado</p>
                    <p className="text-sm text-muted-foreground">Maria Silva - maria@email.com</p>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">Ontem, 09:15</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}

