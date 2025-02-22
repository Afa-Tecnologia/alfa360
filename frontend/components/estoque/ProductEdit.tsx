import React, { useEffect, useRef, useState } from 'react';
import { HiPencilAlt } from 'react-icons/hi';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProductStore } from '@/stores/createProductStore';
import CloudinaryUploader from './CloudinaryUploader';
import CategoriaListing from './CategoriasListing';
import SelectSize from './SelectSize';
import SelectTipoProduto from './SelectTipo';
import { SelectColor } from './SelectColors';
import { QuantityInput } from '../Reusable/QuantityInput';
import VariantsForm from './VariantsForm';
import { Product, Variant } from '@/types/estoque';
import { gerarNotificacao } from '@/utils/toast';
import { useUtilStore } from '@/stores/utilStore';

interface IProductEdit {
  isOpen?: boolean;
  product?: Product;
}

export function ProductEdit({ product }: IProductEdit) {
  const [prodQuantity, setProdQuantity] = useState(0);
  const [selectCategoria, setSelectedCategoria] = useState<string | number>(0);
  const [arrVariants, setArrVariants] = useState<Variant[]>([]);

  //Estados do Produto
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [description, setDescription] = useState('');
  const [purchasePrice, setPurchasePrice] = useState(0);
  const [sellingPrice, setSellingPrice] = useState(0);
  const [isNameDisabled, setIsNameDisabled] = useState(false);
  const [isDescriptionDisabled, setIsDescriptionDisabled] = useState(false);

  const { isSheetOpen, setIsSheetOpen } = useUtilStore();

  //Stores de produtos
  const {
    productStore,
    productsStore,
    setProductStore,
    addVariant,
    setVariants,
    variants,
    tipoProduto,
    setTipoProduto,
    color,
    size,
    selectedCategoria,
    setImageUrl,
    imageUrl,
    setSize,
  } = useProductStore();

  const handleQuantity = (qtd: number) => {
    setProdQuantity(qtd);
  };
  const handleSelectCategoria = (categoria: number | string) => {
    setSelectedCategoria(categoria);
  };

  const resetForm = () => {
    handleQuantity(0);
    handleQuantity(0);
    setSellingPrice(0);
    setPurchasePrice(0);
    setSize(['']);
    setImageUrl(null);
  };

  const handleAddVariant = async () => {
    const currentVariant = {
      id: Date.now(),
      name: `${name} ${color[0]} ${size[0]}`,
      type: tipoProduto,
      quantity: prodQuantity,
      color: color[0],
      size: size[0],
      selling_price: +sellingPrice,
      image_url: imageUrl,
    };
    const variantes = await addVariant(currentVariant);
    if (variantes) {
      gerarNotificacao('success', 'Variante adcionada com sucesso');
    } else {
      gerarNotificacao('error', 'Variante não adicionada');
    }
    resetForm();
  };

  const payloadProduct: Product = {
    name: name,
    description: description,
    variantes: variants,
    categoria_id: selectedCategoria,
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAddVariant();

    console.log(`VARIANTE: ${JSON.stringify(variants)}`);
    console.log(`payloa de produtos: ${JSON.stringify(payloadProduct)}`);
  };

  //Para edição
  useEffect(() => {
    if (productStore) {
      setName(productStore.name || '');
      setTipoProduto(productStore.type || '')
      setBrand(productStore.brand || '');
      setDescription(productStore.description || '');
      setPurchasePrice(productStore.purchase_price || 0);
      setSellingPrice(productStore.selling_price || 0);
      setArrVariants(productStore.variantes || []);
      setVariants(productStore.variantes || []);
    }
  }, [productStore]);


  

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent className="min-h-screen overflow-y-auto gap-4">
        <SheetHeader>
          <SheetTitle>Editar / Criar - Produtos</SheetTitle>
        </SheetHeader>
        <Tabs defaultValue="product">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="product">Informações do produto</TabsTrigger>
            <TabsTrigger value="variants">Variantes</TabsTrigger>
          </TabsList>
          <TabsContent value="product">
            <CloudinaryUploader product={product} />
            <SelectTipoProduto />
            <div className="mb-4">
              <CategoriaListing selectCategoria={handleSelectCategoria} />
            </div>

            <div>
              {tipoProduto && <SelectSize tipo_produto={tipoProduto} />}
              <div className="mb-4 relative">
                <Label>Nome do produto</Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => name.trim() && setIsNameDisabled(true)} // Desativa após perder o foco se não estiver vazio
                  required
                  disabled={isNameDisabled}
                />
                {isNameDisabled && (
                  <div className=" absolute right-0 top-2">
                    <HiPencilAlt
                      onClick={() => setIsNameDisabled(false)}
                      className=" text-green-700 cursor-pointer"
                    />
                  </div>
                )}
              </div>

              <div className="mb-4 relative">
                <Label>Descrição</Label>
                <Input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  onBlur={() =>
                    description.trim() && setIsDescriptionDisabled(true)
                  } // Desativa após perder o foco se não estiver vazia
                  required
                  disabled={isDescriptionDisabled}
                />
                {isDescriptionDisabled && (
                  <div className=" absolute right-0 top-2">
                    <HiPencilAlt
                      onClick={() => setIsDescriptionDisabled(false)}
                      className=" text-green-700 cursor-pointer"
                    />
                  </div>
                )}
              </div>
              <div className="mb-4">
                <Label>Preço de Compra</Label>
                <Input
                  value={purchasePrice}
                  onChange={(e) => setPurchasePrice(+e.target.value)}
                  type="number"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-4">
                <Label>Preço de Venda</Label>
                <Input
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(+e.target.value)}
                  type="number"
                  step="0.01"
                  required
                />
              </div>
              <div className="mb-4">
                <QuantityInput
                  label="Quantidade em estoque"
                  value={prodQuantity}
                  onChange={handleQuantity}
                />
              </div>
              <div className="mb-4">
                <Label>Cor Predominante do Produto:</Label>
                <SelectColor tipo_produto={tipoProduto} />
              </div>
              <div className="mb-4">
                <Label>Marca:</Label>
                <Input
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  required
                />
              </div>

              {product?.variantes > 0 ? null : <Button type="button" onClick={(e) => handleSubmit(e)}>
                Adicionar Variante
              </Button>}
              <div className="flex justify-end mt-4">
                <Button type="submit">Salvar</Button>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="variants">
            <VariantsForm />
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
