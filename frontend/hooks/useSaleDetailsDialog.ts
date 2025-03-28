"use client"
import { useState } from 'react';

export function useSaleDetailsDialog() {
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [selectedSale, setSelectedSale] = useState<any>(null);

  // Função para abrir o modal e passar os detalhes da venda
  const handleViewDetails = (sale: any) => {
    setSelectedSale(sale);
    setIsDetailsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDetailsDialogOpen(false);
    setSelectedSale(null);  // Limpar a venda selecionada ao fechar
  };

  return {
    isDetailsDialogOpen,
    selectedSale,
    handleViewDetails,
    closeDialog,
  };
}
