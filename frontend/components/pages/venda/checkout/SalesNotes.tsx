'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { CheckCircle2, CircleCheck, CreditCard, Loader2 } from 'lucide-react';
import CurrencyPayment from './currency-sucess';
import { motion } from 'framer-motion';
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
    paymentMethod: string;
    createdAt: Date;
  };
}

interface NotesSaleModalProps {
  openDialog: boolean;
  onOpenChangeDialog: (isOpen: boolean) => void;
  notesSales: SalesNotes;
}

export function SalesNotes({
  openDialog,
  onOpenChangeDialog,
  notesSales,
}: NotesSaleModalProps) {
  const [showReceipt, setShowReceipt] = useState(false);

  // Simular o processo de checkout quando o modal é aberto
  useEffect(() => {
    if (openDialog) {
      setShowReceipt(true);
    }
  }, [openDialog]);

  const handleCloseReceipt = () => {
    onOpenChangeDialog(false);
  };
  const detailsPayment = () => {
    // Simular o processamento do pagamento
    console.log('Pagamento realizado com sucesso!');
    setShowReceipt(false);
  };

  // Determinar qual método de pagamento mostrar no ícone
  const getPaymentIcon = () => {
    switch (notesSales.sale.paymentMethod) {
      case 'cartao':
        return <CreditCard className="h-6 w-6" />;
      default:
        return <CreditCard className="h-6 w-6" />;
    }
  };

  // Traduzir o método de pagamento para exibição
  const getPaymentMethodDisplay = () => {
    const methods: Record<string, string> = {
      dinheiro: 'Dinheiro',
      cartao: 'Cartão',
      pix: 'PIX',
      condicional: 'Condicional',
    };

    return (
      methods[notesSales.sale.paymentMethod] || notesSales.sale.paymentMethod
    );
  };

  return (
    <div>
      <Dialog open={openDialog} onOpenChange={onOpenChangeDialog}>
        <DialogContent className="sm:max-w-[500px]">
          {showReceipt ? (
            // Tela de processamento estilo Stripe
            <>
              <DialogHeader>
                <DialogTitle></DialogTitle>
              </DialogHeader>
              <CurrencyPayment
                price={notesSales.sale.total}
                total={notesSales.sale.total}
              />
              <div className="flex justify-end">
                <Button
                  size={'sm'}
                  className="  sm:h-[40px] "
                  onClick={detailsPayment}
                  disabled={!showReceipt}
                >
                  Ver Comprovante
                </Button>
              </div>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Comprovante de Venda</DialogTitle>
                <DialogDescription>
                  Venda realizada com sucesso!
                </DialogDescription>
              </DialogHeader>
              {notesSales && (
                <div className="py-4 space-y-4">
                  <motion.div
                    className="flex-1 bg-[#f4f4f480] dark:bg-zinc-500/50 rounded-xl p-3 border border-zinc-700/50 dark:border-zinc-200/50 backdrop-blur-md"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 0.8,
                      duration: 0.2,
                      ease: [0.4, 0, 0.2, 1],
                    }}
                  >
                    <div className="border-b pb-2">
                      <motion.p
                        className="text-sm text-zinc-900 dark:text-zinc-100 tracking-tighter font-semibold uppercase"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 0.4 }}
                      >
                        PDV LesAmis
                      </motion.p>
                      <motion.p
                        className="text-sm text-muted-foreground tracking-tighter "
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 0.4 }}
                      >
                        {notesSales.sale.createdAt.toLocaleString('pt-BR')}
                      </motion.p>
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.3, duration: 0.4 }}
                      >
                        Cliente: {notesSales.sale.customerName}
                      </motion.p>
                    </div>
                    <div className="space-y-2">
                      <motion.p
                        className="font-semibold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.4, duration: 0.4 }}
                      >
                        Itens:
                      </motion.p>
                      {notesSales.sale.items.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm"
                        >
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.5, duration: 0.4 }}
                          >
                            {item.quantity}x {item.productName}
                          </motion.span>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1.6, duration: 0.4 }}
                          >
                            {item.total.toLocaleString('pt-BR', {
                              style: 'currency',
                              currency: 'BRL',
                            })}
                          </motion.span>
                        </div>
                      ))}
                    </div>
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.7, duration: 0.4 }}
                      >
                        Total:
                      </motion.span>
                      <motion.span     initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.8, duration: 0.4 }}
                      >
                        {notesSales.sale.total.toLocaleString('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        })}
                      </motion.span>
                    </div>
                    <div className="text-sm">
                      <motion.p className="text-sm text-muted-foreground"     initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.9, duration: 0.4 }}
                      >
                        Método de Pagamento
                      </motion.p>
                      <motion.p className="font-medium"     initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 2, duration: 0.4 }}
                      >
                        {getPaymentMethodDisplay() || 'Desconhecido'}
                      </motion.p>
                    </div>
                  </motion.div>
                </div>
              )}
              <DialogFooter>
                <Button type="button" onClick={handleCloseReceipt} className=''>
                  Fechar
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
