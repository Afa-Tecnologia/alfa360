'use client';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { api } from '@/app/api/api';
import { useEffect, useState } from 'react';
import { Categoria } from '@/types/categoria';
interface ICategoriaListing {
  children?: React.ReactElement;
  produto?: string | any;
  selectCategoria: (value: string) => any;
}

export default function CategoriaListing(props: ICategoriaListing) {
  const fetchCategoria = async () => {
    try {
      const response = await api.get('/categorias');
      const categorias = response?.data as Categoria[];

      setCategories(categorias);
    } catch (e) {
      console.log(e);
      return [];
    }
  };

  const [categories, setCategories] = useState<Categoria[]>([]);

  useEffect(() => {
    fetchCategoria();
    console.log(categories);
  }, []);
  return (
    <>
      <Select onValueChange={(value) => props.selectCategoria(value)}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Categorias" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Categorias</SelectLabel>
            {categories.length > 0 &&
              categories.map((item) => (
                <SelectItem key={item.id} value={item.id.toString()}>
                  {item.name}
                </SelectItem>
              ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  );
}
