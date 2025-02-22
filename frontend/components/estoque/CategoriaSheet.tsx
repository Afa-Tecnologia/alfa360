import { api } from '@/app/api/api';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Product } from '@/types/product';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import CategoriaListing from './CategoriasListing';
import SizeSelectors from './SelectSize';
import SelectTipoProduto from './SelectTipo';

interface IProductEdit {
  product?: Product;
  isOpen?: boolean | any;
}

export function ProductEdit(props: IProductEdit) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedtipoProduto, setSelectedtipoProduto] = useState(null);
  const [variantes, setVariantes] = useState([]);
  const [selectedCategoria, setSelectedCategoria] = useState<any>(null);
  const { register, handleSubmit, reset, setValue } = useForm<
    Omit<Product, 'id'>
  >({
    defaultValues: {
      name: '',
      description: '',
      purchase_price: 0,
      selling_price: 0,
      quantity: 0,
      categoria_id: undefined,
    },
  });

  useEffect(() => {
    setIsDialogOpen(props.isOpen);
  }, [props.isOpen, props.product]);

  useEffect(() => {
    if (props.product) {
      // Preencher os campos ao abrir o modal com os dados do produto
      setValue('name', props.product.name || '');
      setValue('description', props.product.description || '');
      setValue('purchase_price', props.product.purchase_price || 0);
      setValue('selling_price', props.product.selling_price || 0);
      setValue('quantity', props.product.quantity || 0);
      setValue('categoria_id', props.product.categoria_id || undefined);
    }
  }, [props.product, setValue]);

  async function handleCreateOrUpdateProduct(data: Omit<Product, 'id'>) {
    try {
      if (props.product) {
        await api.put(`/produtos/${props.product.id}`, data);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await api.post('/produtos', data);
        toast.success('Produto criado com sucesso!');
      }
      setIsDialogOpen(false);
      reset();
    } catch (error) {
      toast.error('Erro ao salvar produto.');
    }
  }
  const handleSelectCategoria = (categoria: string) => {
    setSelectedCategoria(categoria);
    console.log('Categoria selecionada:', categoria);
  };

  const handleSelectTipoProduto = (tipo: string) => {
    setSelectedtipoProduto(tipo);
    console.log('Tipo selecionada:', tipo);
  };
  return (
    <div>
      <Sheet open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <SheetTrigger asChild>
          {/* <Button variant="outline" onClick={() => setIsDialogOpen(true)}>
          Ver Detalhes
        </Button> */}
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Editar / Criar - Produtos</SheetTitle>
          </SheetHeader>
          <form
            onSubmit={handleSubmit(handleCreateOrUpdateProduct)}
            className=" flex flex-col gap-4"
          >
            {/* <ImageUploader onUpload={handleUploadComplete} /> */}
            <SelectTipoProduto selectTipoProduto={handleSelectTipoProduto} />
            {selectedtipoProduto && (
              <SizeSelectors tipo_produto={selectedtipoProduto} />
            )}
            <div className="mb-4">
              <label className="block font-medium mb-1">Nome do produto</label>
              <input
                className="w-full border p-2"
                {...register('name')}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Descrição</label>
              <input
                className="w-full border p-2"
                {...register('description')}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Preço de Compra</label>
              <input
                type="number"
                step="0.01"
                className="w-full border p-2"
                {...register('purchase_price')}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">Preço de Venda</label>
              <input
                type="number"
                step="0.01"
                className="w-full border p-2"
                {...register('selling_price')}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block font-medium mb-1">
                Quantidade em estoque
              </label>
              <input
                type="number"
                className="w-full border p-2"
                {...register('quantity')}
                required
              />
            </div>
            <CategoriaListing selectCategoria={handleSelectCategoria} />
            <div className="flex justify-end mt-4">
              <SheetClose asChild>
                <Button type="submit">Salvar</Button>
              </SheetClose>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}
