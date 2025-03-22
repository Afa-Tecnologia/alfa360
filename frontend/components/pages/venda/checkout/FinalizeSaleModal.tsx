// 'use client';

// import { useState } from 'react';
// import {
//   Dialog,
//   DialogContent,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from '@/components/ui/dialog';
// import { Button } from '@/components/ui/button';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Input } from '@/components/ui/input';
// import { useCartStore } from '@/stores/cart-store';
// import { createPedido } from '@/services/pedidos/CreatePedidos';
// import { gerarNotificacao } from '@/utils/toast';

// interface FinalizeSaleModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSuccess: () => void;
// }

// const paymentMethods = {
//   dinheiro: 'Dinheiro',
//   cartao: 'Cartão',
//   pix: 'PIX',
//   condicional: 'Condicional',
// } as const;

// export default function FinalizeSaleModal({
//   isOpen,
//   onClose,
//   onSuccess,
// }: FinalizeSaleModalProps) {
//   const { items, total, clearCart, addItem } = useCartStore();
//   const [customerName, setCustomerName] = useState('');
//   const [paymentMethod, setPaymentMethod] =
//     useState<keyof typeof paymentMethods>('dinheiro');
//   const [loading, setLoading] = useState(false);

//   const handleSubmit = async () => {
//     if (items.length === 0) return alert('Carrinho vazio');

//     setLoading(true);

//     try {
//       const response = await createPedido();
//       addItem(response); // Atualiza o estado com o cliente criado na API

//       gerarNotificacao('success', 'Pedido criado com sucesso!');

//       clearCart();
//       onSuccess();
//       onClose();
//     } catch (error) {
//       console.error('Erro ao finalizar venda:', error);
//       alert('Erro ao finalizar venda');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent>
//         <DialogHeader>
//           <DialogTitle>Finalizar Venda</DialogTitle>
//         </DialogHeader>
//         <div className="space-y-4">
//           <Select
//             value={clienteId || ''}
//             onValueChange={(value) => setClienteId(Number(value))}
//           >
//             <SelectItem value="">Selecione um cliente</SelectItem>
//             {clientes.map((cliente) => (
//               <SelectItem key={cliente.id} value={cliente.id.toString()}>
//                 {cliente.nome}
//               </SelectItem>
//             ))}
//           </Select>
//           <Select
//             value={paymentMethod}
//             onValueChange={(value) =>
//               setPaymentMethod(value as keyof typeof paymentMethods)
//             }
//           >
//             <SelectTrigger>
//               <SelectValue placeholder="Forma de Pagamento" />
//             </SelectTrigger>
//             <SelectContent>
//               {Object.entries(paymentMethods).map(([key, label]) => (
//                 <SelectItem key={key} value={key}>
//                   {label}
//                 </SelectItem>
//               ))}
//             </SelectContent>
//           </Select>
//           <p className="text-lg font-bold">Total: R$ {total().toFixed(2)}</p>
//         </div>
//         <DialogFooter>
//           <Button variant="outline" onClick={onClose}>
//             Cancelar
//           </Button>
//           <Button onClick={handleSubmit} disabled={loading}>
//             {loading ? 'Finalizando...' : 'Confirmar Venda'}
//           </Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
