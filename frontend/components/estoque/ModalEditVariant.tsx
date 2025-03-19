// import { useProductStore } from '@/stores/createProductStore';
// import { useUtilStore } from '@/stores/utilStore';
// import { Button } from '@/components/ui/button';
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from '@/components/ui/dialog';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { SelectColor } from './SelectColors';
// import SizeSelectors from './SelectSize';

// export default function ModalEditVariant() {
//   //Stores do produto a ser editado
//   const { variant } = useProductStore();

//   //Utils Store

//   const { setIsDialogOpen, isDialogOpen } = useUtilStore();

//   return (
//     <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>
//             Editando: <b>{variant.name}</b>
//           </DialogTitle>
//           <DialogDescription>
//             Faça as alterações necessárias na variante
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex flex-col gap-4 py-4">
//           <div className=" gap-4">
//             <Label htmlFor="color" >
//               Cor
//             </Label>
//             <SelectColor tipo_produto={variant.type || ''} />
//           </div>
//           <div className="flex flex-col gap-4">
//             <Label htmlFor="size" >
//               Tamanho
//             </Label>
//             <Input
//               value={variant.size}
//               id="size"
//               placeholder="Ex: M, G, GG"
//               className="col-span-3"
//             />

//             <SizeSelectors tipo_produto={variant.type || ''}/>
//           </div>
//           <div className="flex flex-col gap-4">
//             <Label htmlFor="price" >
//               Preço
//             </Label>
//             <Input
//               value={variant.selling_price}
//               id="price"
//               type="number"
//               placeholder="Ex: 99.90"
//               className="col-span-3"
//             />
//           </div>
//           <div className="flex flex-col gap-4">
//             <Label htmlFor="stock" >
//               Estoque
//             </Label>
//             <Input
//               value={variant.quantity}
//               id="stock"
//               type="number"
//               placeholder="Ex: 50"
//               className="col-span-3"
//             />
//           </div>
//         </div>
//         <DialogFooter>
//           <Button type="submit">Save changes</Button>
//         </DialogFooter>
//       </DialogContent>
//     </Dialog>
//   );
// }
