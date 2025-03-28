import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { formatDateTime } from "../../clientes/format-data-time";
import { formatCurrency } from "../../clientes/format-currency";


interface Props {
  isOpen: boolean;
  onClose: () => void;
  sale: any | null;
}

export function SaleDetailsDialog({ isOpen, onClose, sale }: Props) {
  if (!sale) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Venda</DialogTitle>
          <DialogDescription>Informações completas da transação</DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">ID da Venda</p>
              <p className="font-medium">{sale.id}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Data</p>
              <p className="font-medium">{formatDateTime(sale.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cliente</p>
              <p className="font-medium">{sale.cliente.name} {sale.cliente.last_name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Método de Pagamento</p>
              <p className="font-medium">{sale.payment_method || "Desconhecido"}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="font-semibold mb-2">Itens:</p>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Produto</TableHead>
                  <TableHead className="text-right">Qtd</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sale.produtos.map((item: any, index: number) => (
                  <TableRow key={index}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number(item.purchase_price))}</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number(item.selling_price))}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
