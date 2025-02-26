'use client';
import { useEffect, useState } from 'react';
import { Product, useProductStore } from '@/stores/productStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { FaRegTrashAlt } from 'react-icons/fa';
import { HiOutlinePencilSquare } from 'react-icons/hi2';
import CreateProductForm from './ProductCreateForm';
import EditProductForm from './ProductEditForm';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from '@radix-ui/react-dialog';
import { DialogHeader } from '../ui/dialog';
import { gerarNotificacao } from '@/utils/toast';
import { api } from '@/app/api/api';

export default function ProductList() {
  const {
    products,
    setProducts,
    product,
    deleteProduct,
    setCurrentProduct,
    setPurchasePrice,
    setSelectedCategoria,
    setSellingPrice,
    setTipoProduto,
  } = useProductStore();
  const { openForm, closeForm, setIsOpenCreate, setIsOpenEdit } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  //Limpa tudo
  const clearDataProduct = () => {
    setCurrentProduct({
      id: '',
      name: '',
      description: '',
      purchase_price: 0,
      selling_price: 0,
      quantity: 0,
      brand: '',
      type: '',
      variants: [],
      categoria_id: 0,
    });

    // setSelectedCategoria(0);
    // setTipoProduto('');
    // setSellingPrice(0);
    // setPurchasePrice(0);
  };

  //Função para criar um novo produto
  const handleNewProductForm = (product: Product) => {
    clearDataProduct();
    setIsOpenCreate(true);
  };

  //Função para editar um  produto
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    openForm(product.id);
  };

  const handleDeleteProduct = (id: number | string) => {
    deleteProduct(id);
  };

  const fetchProdutos = async () =>{
    try{
      const response = await api.get('/produtos');
      const products = response?.data;
      setProducts(products)
    } catch (e){
      gerarNotificacao('error', 'Erro ao buscar produtos')
    }
  }

  useEffect(() =>{
    console.log(JSON.stringify(fetchProdutos()))
  },[])

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar produto..."
        />
        <Button onClick={() => handleNewProductForm(product)}>
          + Novo Produto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {paginatedProducts.map((product) => (
          <Card key={product.id}>
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>

              <div className="flex flex-row gap-4 justify-end">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <FaRegTrashAlt
                        size={24}
                        className=" text-red-700 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteProduct(product.id || 0);
                        }}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Excluir Permanentemente o Produto</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HiOutlinePencilSquare
                        size={26}
                        className="cursor-pointer text-green-800"
                        onClick={() => handleEditProduct(product)}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Editar Produto</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center">
        <Button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Anterior
        </Button>

        <span>
          Página {currentPage} de {totalPages || 1}
        </span>

        <Button
          disabled={currentPage === totalPages || totalPages === 0}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Próxima
        </Button>

        <select
          value={itemsPerPage}
          onChange={(e) => setItemsPerPage(Number(e.target.value))}
          className="ml-2 p-2 border rounded"
        >
          <option value={5}>5 por página</option>
          <option value={10}>10 por página</option>
          <option value={20}>20 por página</option>
        </select>
      </div>

      <CreateProductForm />
      <EditProductForm />
    </div>
  );
}
