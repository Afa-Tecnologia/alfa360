import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";
import { formatDateTime } from "../clientes/format-data-time";
import { formatCurrency } from "../clientes/format-currency";


interface Props {
  sales: any[];
  handleViewDetails: (sale: any) => void;
}

export function PedidosTable({ sales, handleViewDetails }: Props) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead className="text-center">Data da Venda</TableHead>
          <TableHead className="text-center">Cliente</TableHead>
          <TableHead className="text-center">Método de Pagamento</TableHead>
          <TableHead className="text-center">Total</TableHead>
          <TableHead className="text-right">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-4">
              Nenhuma venda encontrada
            </TableCell>
          </TableRow>
        ) : (
          sales.map((sale) => (
            <TableRow key={sale.id}>
              <TableCell className="font-medium">{sale.id}</TableCell>
              <TableCell className="text-center">{formatDateTime(sale.created_at)}</TableCell>
              <TableCell className="text-center">
                {sale.cliente.name} {sale.cliente.last_name}
              </TableCell>
              <TableCell className="text-center">{sale.payment_method || "Desconhecido"}</TableCell>
              <TableCell className="text-center">{formatCurrency(sale.total)}</TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="icon" onClick={() => handleViewDetails(sale)}>
                  <FileText className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
    
  );
}
