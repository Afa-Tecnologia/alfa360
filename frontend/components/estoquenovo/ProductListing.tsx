'use client';
import { useState } from 'react';
import { Product, useProductStore } from '@/stores/productStore';
import { useUIStore } from '@/stores/uiStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import ProductForm from './ProductForm';

export default function ProductList() {
  const {
    products,
    product,
    deleteProduct,
    setCurrentProduct,
    setPurchasePrice,
    setSelectedCategoria,
    setSellingPrice,
    setTipoProduto,
  } = useProductStore();
  const { openForm } = useUIStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentProduct({} as Product);
    setSelectedCategoria(0);
    setTipoProduto('');
    setSellingPrice(0);
    setPurchasePrice(0);
  };

  //Função para criar um novo produto
  const handleNewProductForm = (product: Product) => {
    // clearDataProduct();
    openForm();
  };
  //Função para editar um  produto
  const handleEditProduct = (product: Product) => {
    setCurrentProduct(product);
    openForm(product.id);
  };

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
          <Card
            key={product.id}
            className="cursor-pointer"
            onClick={() => handleEditProduct(product)}
          >
            <CardHeader>
              <CardTitle>{product.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{product.description}</p>
              <Button
                variant="destructive"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteProduct(product.id);
                }}
              >
                Excluir
              </Button>
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

      <ProductForm />
    </div>
  );
}
