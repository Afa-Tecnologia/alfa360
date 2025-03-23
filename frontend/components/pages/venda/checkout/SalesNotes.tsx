import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
interface SalesNotes {
    sale: {
        items: {
            productId: number;
            productName: string;
            quantity: number;
            unitPrice: number;
            total: number;
        }[];
        total: number;
        desconto: number;
        customerName: string;
        paymentMethod : string
        createdAt: Date;
    }
}
interface NotesSaleModalProps {
  openDialog: boolean;
  onOpenChangeDialog: (isOpen: boolean) => void;
  notesSales: SalesNotes;
}


export function SalesNotes({ openDialog, onOpenChangeDialog, notesSales}: NotesSaleModalProps){
const handleCloseReceipt =() => {
    onOpenChangeDialog(false);
  
}

    return(
        <div>
              {/* Modal Ver comprovante da Venda */}
      <Dialog open={openDialog} onOpenChange={onOpenChangeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Comprovante de Venda</DialogTitle>
            <DialogDescription>Venda realizada com sucesso!</DialogDescription>
          </DialogHeader>
          {notesSales && (
            <div className="py-4 space-y-4">
              <div className="border-b pb-2">
                <p className="font-bold">PDV System</p>
                <p className="text-sm text-muted-foreground">
                  {notesSales.sale.createdAt.toLocaleString('pt-BR')}
                </p>
                <p className="text-sm">Cliente: {notesSales.sale.customerName}</p>
              </div>
              <div className="space-y-2">
                <p className="font-semibold">Itens:</p>
                {notesSales.sale.items.map((item: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>
                      {item.quantity}x {item.productName}
                    </span>
                    <span>
                      {item.total.toLocaleString('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      })}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  {notesSales.sale.total.toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  })}
                </span>
              </div>
              <div className="text-sm">
                <p className="text-sm text-muted-foreground">
                  Método de Pagamento
                </p>
                <p className="font-medium">
                  {notesSales.sale.paymentMethod  ||
                    'Desconhecido'}
                </p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button type="button" onClick={handleCloseReceipt}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
        </div>
    )
}