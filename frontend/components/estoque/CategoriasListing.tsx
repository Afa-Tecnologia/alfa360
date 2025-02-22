// 'use client';
// import {
//   Select,
//   SelectContent,
//   SelectGroup,
//   SelectItem,
//   SelectLabel,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';

// import { api } from '@/app/api/api';
// import { useEffect, useState } from 'react';
// import { Categoria } from '@/types/categoria';
// import { Label } from '../ui/label';
// import { useProductStore } from '@/stores/productStore';
// interface ICategoriaListing {
//   children?: React.ReactElement;
//   produto?: string | any;
//   selectCategoria?: (value: string | number) => any;
// }

// export default function CategoriaListing(props: ICategoriaListing) {
//   const {setSelectedCategoria, product, selectedCategoria} = useProductStore();
//   const fetchCategoria = async () => {
//     try {
//       const response = await api.get('/categorias');
//       const categorias = response?.data as Categoria[];

//       setCategories(categorias);
    
//     } catch (e) {
//       console.log(e);
//       return [];
//     }
//   };

//   const [categories, setCategories] = useState<Categoria[]>([]);

//   useEffect(() => {
//     fetchCategoria();
//     setSelectedCategoria(product.categoria_id)
//   }, []);

  
//   return (
//     <div>
//        <Label className="text-base font-semibold mb-4">Categoria do Produto</Label>
//       <Select onValueChange={(value) => setSelectedCategoria(value)}>
//         <SelectTrigger className="w-[180px]">
//           <SelectValue placeholder="Selecione..." />
//         </SelectTrigger>
//         <SelectContent>
//           <SelectGroup>
//             {categories.length > 0 &&
//               categories.map((item) => (
//                 <SelectItem key={item.id} value={item.id.toString()}>
//                   {item.name}
//                 </SelectItem>
//               ))}
//           </SelectGroup>
//         </SelectContent>
//       </Select>
//     </div>
//   );
// }
'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { api } from '@/app/api/api';
import { useEffect, useState } from 'react';
import { Categoria } from '@/types/categoria';
import { Label } from '../ui/label';
import { useProductStore } from '@/stores/productStore';

interface ICategoriaListing {
  children?: React.ReactElement;
  produto?: string | any;
  selectCategoria?: (value: string | number) => any;
  onChange: (categoria_id?: number | string) => void;

}

export default function CategoriaListing(props: ICategoriaListing) {
  const { setSelectedCategoria, product } = useProductStore();
  
  const [categories, setCategories] = useState<Categoria[]>([]);
  const [selectedCategoria, setSelectedCategoriaState] = useState<string | undefined>(undefined);

  const fetchCategoria = async () => {
    try {
      const response = await api.get('/categorias');
      const categorias = response?.data as Categoria[];
      setCategories(categorias);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchCategoria();
    if (product?.categoria_id) {
      setSelectedCategoriaState(product.categoria_id.toString());
      setSelectedCategoria(product.categoria_id.toString());
    }
  }, []);

  const handleChange = (value: string) => {
    props.onChange(value)
    setSelectedCategoriaState(value);
    setSelectedCategoria(value);
  };

  return (
    <div>
      <Label className="text-base font-semibold mb-4">Categoria do Produto</Label>
      <Select value={selectedCategoria} onValueChange={handleChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Selecione..." />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {categories.length > 0 &&
              categories.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
