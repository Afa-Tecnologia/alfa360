// import { Button } from "@/components/ui/button";


// import { useCartStore } from "@/stores/useCartStore";

// import { ShoppingCart } from "lucide-react";
// import Image from "next/image";
// import Link from "next/link";
// import { toast } from "react-toastify";
// import { Product } from "./Cards-Products";


// interface ProductCardProps {
//     product: Product;
//   }

// export default function ProductCard({ product }: ProductCardProps) {
//   const addToCart = useCartStore((state) => state.addToCart);
  
 
//         const handleAddToCart = (e: React.MouseEvent) => {
//             e.preventDefault();
//             addToCart(product);
//             toast.success('Added to cart');
//           };
        
//           return (
//             <div className="group relative">
          

//             <Link href="" className="group relative">
//               <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-lg">
//                 <Image
//                   src={product.image}
//                   alt={product.name}
//                   width={500}
//                   height={500}
//                   className="h-full w-full object-cover object-center group-hover:opacity-75 transition"
//                 />
//               </div>
//               </Link>
//               <div className="mt-4 flex justify-between">
//                 <div>
//                   <h3 className="text-sm font-medium">{product.name}</h3>
//                   <p className="mt-1 text-sm text-muted-foreground">{product.category}</p>
//                 </div>
//                 <p className="text-sm font-medium">{product.selling_price}</p>
//               </div>
//               <Button
//                 onClick={handleAddToCart}
//                 className="w-full mt-4"
//                 variant="secondary"
//               >
//                 <ShoppingCart className="mr-2 h-4 w-4" />
//                 Add to Cart
//               </Button>
              
//             </div>
//           );
//   }