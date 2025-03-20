import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type SaleItem = {
  id: string;
  createdAt: Date;
  customerName: string;
  paymentMethod: string;
  total: number;
};

interface CardsVendasProps {
  sales: SaleItem[];
}

export function CardsVendas({ sales }: CardsVendasProps) {
  const totalVendas = sales.length;
  const valorTotal = sales.reduce((acc, sale) => acc + sale.total, 0);
  const ticketMedio = totalVendas > 0 ? valorTotal / totalVendas : 0;

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
          <CardDescription>Número de transações</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalVendas}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
          <CardDescription>Soma de todas as vendas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {valorTotal.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
          <CardDescription>Valor médio por venda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {ticketMedio.toLocaleString("pt-BR", {
              style: "currency",
              currency: "BRL",
            })}
          </div>
        </CardContent>
      </Card>
  
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Itens Vendidos</CardTitle>
            <CardDescription>Total de produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {/* {sales.reduce((acc, sale) => acc + sale.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0), 0)} */}
              {/* {sales.reduce((acc, sale) => acc + sale.quantity, 0)} */}
              5
            </div>
          </CardContent>
        </Card>
      </div>

    )
}