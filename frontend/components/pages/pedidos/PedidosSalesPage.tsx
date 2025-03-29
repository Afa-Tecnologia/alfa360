'use client';
import { usePedidos } from '@/hooks/usePedidos';
import { PedidosTable } from './PedidosTable';
import { Pagination } from './Pagination';
import { SearchBar } from './SearchBarPedidos';
import { ItemsPerPageSelector } from './ItemsPerPageSelector';
import { SaleDetailsDialog } from './modals/SaleDetailsDialog';
import { useSaleDetailsDialog } from '@/hooks/useSaleDetailsDialog';  // Importar o hook

export default function PedidosPageSales() {
  const {
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    getCurrentPageItems,
  } = usePedidos();

  const {
    isDetailsDialogOpen,
    selectedSale,
    handleViewDetails,
    closeDialog,
  } = useSaleDetailsDialog();  // Usar o hook

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Histórico de Vendas</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        <ItemsPerPageSelector
          itemsPerPage={itemsPerPage}
          setItemsPerPage={setItemsPerPage}
        />
      </div>

      <div className="rounded-md border">
        <PedidosTable
          sales={getCurrentPageItems()}
          handleViewDetails={handleViewDetails}  // Passando a função de abrir o modal
        />
      </div>

      {/* Paginação */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
      />

      {/* Modal de detalhes da venda */}
      <SaleDetailsDialog
        isOpen={isDetailsDialogOpen}
        onClose={closeDialog}  // Usando a função para fechar o modal
        sale={selectedSale}
      />
    </div>
  );
}
