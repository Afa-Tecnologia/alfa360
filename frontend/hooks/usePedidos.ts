"use client"

import OrdersSales from "@/services/pedidos/SalesOrders";
import { useEffect, useState } from "react";


export function usePedidos() {
  const [pedidos, setPedidos] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    async function fetchPedidos() {
      const data = await OrdersSales.getPedidos();
      setPedidos(data);
    }
    fetchPedidos();
  }, []);

  useEffect(() => {
    setTotalPages(Math.ceil(filteredSales().length / itemsPerPage));
    setCurrentPage(1);
  }, [pedidos, searchTerm, itemsPerPage]);

  const filteredSales = () => {
    return pedidos.filter(
      (sale) =>
        sale?.cliente?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(sale.id).includes(searchTerm)
    );
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSales().slice(startIndex, startIndex + itemsPerPage);
  };

  return {
    pedidos,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    itemsPerPage,
    setItemsPerPage,
    totalPages,
    filteredSales,
    getCurrentPageItems,
  };
}
