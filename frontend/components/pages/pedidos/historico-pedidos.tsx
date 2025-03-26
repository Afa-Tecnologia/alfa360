"use client"

import { useEffect, useState } from "react"
import { useSaleStore } from "@/stores/sale-store"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Search, FileText, Trash2 } from "lucide-react"
import OrdersSales from "@/services/pedidos/SalesOrders"
import CustomerService from "@/services/clientes/CustomerServices"
import { formatDateTime } from "../clientes/format-data-time"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PedidosPage() {
  const { sales, deleteSale } = useSaleStore()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSale, setSelectedSale] = useState<any>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [pedidosRecords, setPedidosRecords] = useState<any[]>([])

  // Paginação
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const pedidos = async () => {
      const pedidosData = await OrdersSales.getPedidos()
      // Buscar informações dos clientes para cada pedido
      const pedidosComClientes = await Promise.all(
        pedidosData.map(async (pedido: any) => {
          const cliente = await CustomerService.getClientsId(pedido.cliente_id)
          return {
            id: pedido.id,
            customerName: `${cliente.name} ${cliente.last_name}`,
            products: pedido.produtos,
            total:  Number(pedido.total).toFixed(2),
            paymentMethod: pedido.payment_method,
            createdAt: pedido.created_at,
            updatedAt: pedido.updated_at,
          }
        }),
      )

      setPedidosRecords(pedidosComClientes)
    }
    pedidos()
  }, [])

  // Filtrar vendas com base no termo de busca
  const filteredSales = pedidosRecords.filter(
    (sale) => sale.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) || String(sale.id).includes(searchTerm),
  )

  // Calcular o número total de páginas
  useEffect(() => {
    setTotalPages(Math.ceil(filteredSales.length / itemsPerPage))
    // Resetar para a primeira página quando o filtro mudar
    setCurrentPage(1)
  }, [filteredSales.length, itemsPerPage])

  // Obter os itens da página atual
  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return filteredSales.slice(startIndex, endIndex)
  }

  const handleViewDetails = (sale: any) => {
    setSelectedSale(sale)
    setIsDetailsDialogOpen(true)
  }

  const handleDeleteSale = (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta venda?")) {
      deleteSale(id)
    }
  }

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page)
    }
  }

  // Gerar array de páginas para navegação
  const getPageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5 // Número máximo de botões de página para mostrar

    if (totalPages <= maxPagesToShow) {
      // Se tivermos menos páginas que o máximo, mostrar todas
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      // Caso contrário, mostrar um subconjunto com a página atual no centro
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
      let endPage = startPage + maxPagesToShow - 1

      if (endPage > totalPages) {
        endPage = totalPages
        startPage = Math.max(1, endPage - maxPagesToShow + 1)
      }

      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i)
      }
    }

    return pageNumbers
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Histórico de Vendas</h1>

      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-11" // Adiciona espaço para o ícone
          />
        </div>

        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Itens por página:</span>
          <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
            <SelectTrigger className="w-[80px]">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>



      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total de Vendas</CardTitle>
            <CardDescription>Número de transações</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pedidosRecords.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
            <CardDescription>Todas as vendas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
            {pedidosRecords
        .reduce((acc, sale) => acc + Number(sale.total), 0) // Garante que total é um número
        .toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ticket Médio</CardTitle>
            <CardDescription>Valor médio por venda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pedidosRecords.length > 0
                ? (pedidosRecords.reduce((acc, sale) => acc + Number(sale.total), 0) / pedidosRecords.length).toLocaleString(
                    "pt-BR",
                    {
                      style: "currency",
                      currency: "BRL",
                    },
                  )
                : "R$ 0,00"}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Itens Vendidos</CardTitle>
            <CardDescription>Total de produtos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pedidosRecords.reduce(
                (acc, sale) =>
                  acc + (sale.products?.reduce((itemAcc: number, item: any) => itemAcc + (item.quantity || 0), 0) || 0),
                0,
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead className="text-center">Data da Venda</TableHead>
              <TableHead className="text-center">Cliente</TableHead>
              <TableHead className="text-center">Método de Pagamento</TableHead>
              <TableHead className="text-center">Total</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {getCurrentPageItems().length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-4">
                  Nenhuma venda encontrada
                </TableCell>
              </TableRow>
            ) : (
              getCurrentPageItems().map((sale) => (
                <TableRow key={sale.id}>
                  <TableCell className="font-medium">{sale.id}</TableCell>
                  <TableCell className="text-center">{formatDateTime(sale.createdAt)}</TableCell>
                  <TableCell className="text-center">{sale.customerName}</TableCell>
                  <TableCell className="text-center">{sale.paymentMethod || "Desconhecido"}</TableCell>
                  <TableCell className="text-center">
                    {sale.total.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" size="icon" onClick={() => handleViewDetails(sale)}>
                        <FileText className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => handleDeleteSale(sale.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {filteredSales.length > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {Math.min((currentPage - 1) * itemsPerPage + 1, filteredSales.length)} a{" "}
            {Math.min(currentPage * itemsPerPage, filteredSales.length)} de {filteredSales.length} registros
          </div>

          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>

              {getPageNumbers().map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink isActive={page === currentPage} onClick={() => handlePageChange(page)}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

              {totalPages > 5 && currentPage < totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalhes da Venda</DialogTitle>
            <DialogDescription>Informações completas da transação</DialogDescription>
          </DialogHeader>
          {selectedSale && (
            <div className="py-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">ID da Venda</p>
                  <p className="font-medium">{selectedSale.id}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Data</p>
                  <p className="font-medium">{formatDateTime(selectedSale.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Cliente</p>
                  <p className="font-medium">{selectedSale.customerName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Método de Pagamento</p>
                  <p className="font-medium">{selectedSale.paymentMethod || "Desconhecido"}</p>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="font-semibold mb-2">Itens:</p>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Produto</TableHead>
                      <TableHead className="text-right">Qtd</TableHead>
                      <TableHead className="text-right">Preço Unit.</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedSale.products.map((item: any, index: number) => (
                      <TableRow key={index}>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">
                          {item.purchase_price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.selling_price.toLocaleString("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="border-t pt-4 flex justify-between font-bold">
                <span>Total:</span>
                <span>
                  {selectedSale.total.toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

