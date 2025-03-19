import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Truck, ArrowRight } from "lucide-react"
import Link from "next/link"

export function PendingShipmentsWidget() {
  // Normalmente, buscaríamos esses dados do backend
  const pendingShipments = [
    {
      id: "123456",
      cliente: "Maria Silva",
      data: "15/03/2024",
      valor: 459.9,
    },
    {
      id: "123455",
      cliente: "João Santos",
      data: "15/03/2024",
      valor: 189.9,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-base font-medium">Pedidos Pendentes de Envio</CardTitle>
          <CardDescription>Pedidos que precisam de código de rastreio</CardDescription>
        </div>
        <Truck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {pendingShipments.length > 0 ? (
            pendingShipments.map((pedido) => (
              <div key={pedido.id} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                <div>
                  <p className="font-medium">#{pedido.id}</p>
                  <p className="text-sm text-muted-foreground">{pedido.cliente}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">R$ {pedido.valor.toFixed(2)}</p>
                  <p className="text-xs text-muted-foreground">{pedido.data}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted-foreground py-4">Nenhum pedido pendente de envio</p>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Link href="/admin/envios" className="w-full">
          <Button variant="outline" className="w-full">
            Ver Todos os Envios
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

