'use client';
import React, { useEffect, useState } from 'react';
import { api } from '@/app/api/api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Spinner } from '../spinner/Spinner';
import EstoqueHeader from '../estoque/EstoqueHeadet';
import { ProductEdit } from '../estoque/ProductSheet';
import { Product, Variant, ImageData, IEstoque } from '@/types/estoque';
import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@radix-ui/react-select';
import { MdOutlineImageNotSupported } from 'react-icons/md';
import Image from 'next/image';

import { CldUploadWidget } from 'next-cloudinary';
import DropDownEditImage from '../imageUploader/DropDownEditImage';

export default function EstoquePage(props: IEstoque) {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isLoading, setIsloading] = useState(true);
  const [editingProduct, setEditingProduct] = useState<Product | null | any>(
    null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const { register, handleSubmit, reset, setValue } = useForm<Variant>({
    defaultValues: {
      name: '',
      type: '',
      color: '',
      size: '',
      stock: 0,
      active: true,
      price: 0,
    },
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, products]);

  async function fetchProducts() {
    try {
      const response = await api.get('/produtos');
      setProducts(response.data);
      setIsloading(false);
    } catch (error) {
      toast.error('Erro ao carregar produtos.');
      setIsloading(false);
    }
  }

  const filterProducts = () => {
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  const handleCreateOrUpdateProduct = async (data: Omit<Product, 'id'>) => {
    try {
      if (editingProduct) {
        await api.put(`/produtos/${editingProduct.id}`, data);
        toast.success('Produto atualizado com sucesso!');
      } else {
        await api.post('/produtos', data);
        toast.success('Produto criado com sucesso!');
      }
      setIsDialogOpen(false);
      reset();
      fetchProducts();
    } catch (error) {
      toast.error('Erro ao salvar produto.');
    }
  };

  const handleSheet = (product: Product | null) => {
    if (product === null) {
      // Se for para criar um novo produto, limpa o produto editado
      setEditingProduct(null);
    } else {
      // Caso contrário, define o produto a ser editado
      setEditingProduct(product);
    }
    setIsSheetOpen(true);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1); // Reset to the first page when changing items per page
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="container mx-auto p-4">
      <Card>
        <EstoqueHeader />
        <div className="flex p-4 space-x-4 sm:w-full">
          <Input
            type="text"
            placeholder="Pesquisar por nome do produto..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-1/3"
          />
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(value) => handleItemsPerPageChange(Number(value))}
          >
            <SelectTrigger className="w-1/3 text-slate-700">
              <SelectValue placeholder="Itens por página" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="30">30</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex p-4">
          <Button
            onClick={() => handleSheet(null)} // Passar null para criar um novo produto
            variant="secondary"
            className="bg-blue-800 hover:bg-blue-600 text-slate-100 font-semibold"
          >
            Criar Produto
          </Button>
        </div>
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Gerenciamento de Produtos
          </CardTitle>
        </CardHeader>
        {isLoading ? (
          <Spinner />
        ) : (
          <CardContent className="cursor-pointer">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-4">
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map((product) => (
                  <Card
                    key={product.id}
                    className={`p-4 text-wrap hover:bg-slate-50 flex flex-col justify-center items-center`}
                  >
                    <div className=" w-full flex flex-col text-center break-words whitespace-normal justify-center items-center">
                      {product.variantes?.[0]?.imagens?.[0]?.url ? (
                        <div>
                          <Image
                            src={product.variantes[0].imagens[0].url}
                            alt={product.name}
                            width={100}
                            height={100}
                            className="h-6/12 object-cover mb-4 rounded-lg"
                          />{' '}
                        </div>
                      ) : (
                        <MdOutlineImageNotSupported size={100} />
                      )}
                      <DropDownEditImage
                        className={`relative mt-[-20px]`}
                        key={product.id}
                        onClick={() => {}}
                      />

                      <CardTitle
                        className=" hover:underline"
                        onClick={() => handleSheet(product)}
                      >
                        {product.name}
                      </CardTitle>
                      <CardTitle>{product.selling_price} R$</CardTitle>
                      <CardDescription>{product.description}</CardDescription>
                      <CardTitle
                        className={`
                         text-sm font-thin
                        ${product.quantity > 2 ? 'text-blue-700' : 'text-red-600'}`}
                      >
                        {product.quantity} em estoque
                      </CardTitle>
                    </div>
                  </Card>
                ))
              ) : (
                <p>Não há produtos para exibir.</p>
              )}
            </div>
          </CardContent>
        )}
        <div className="flex justify-between p-4">
          <Button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Página Anterior
          </Button>
          <Button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Próxima Página
          </Button>
        </div>
      </Card>
      <ProductEdit product={editingProduct} isOpen={isSheetOpen} />
    </div>
  );
}
