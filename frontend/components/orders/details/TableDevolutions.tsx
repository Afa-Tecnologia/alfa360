'use client'

import {
  Table,
  TableCaption,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
  TableFooter,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { MoreVertical } from 'lucide-react'
import { useState } from 'react'

interface Return {
  id: string
  date: string
  client: string
  value: number
  reason: string
  status: 'Pendente' | 'Aprovado' | 'Recusado'
  attendant: string
}

const returns: Return[] = [
]


export function DevoltionsTable() {
    const itemsPerPage = 3
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(returns.length / itemsPerPage)

  const paginatedReturns = returns.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const handlePrevious = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const handleNext = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <div>
      <Table>
        <TableCaption>Lista de devoluções recentes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px]">Número</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Atendente</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paginatedReturns.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="font-medium">#{item.id}</TableCell>
              <TableCell>{item.date}</TableCell>
              <TableCell>{item.client}</TableCell>
              <TableCell>R$ {item.value.toFixed(2)}</TableCell>
              <TableCell>{item.reason}</TableCell>
              <TableCell>
                <Badge variant="outline" className={statusColor(item.status)}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>{item.attendant}</TableCell>
              <TableCell className="text-right">
                <Button size="icon" variant="ghost">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        {returns.length > 0 && (
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell colSpan={5}>
                R${' '}
                {returns.reduce((acc, r) => acc + r.value, 0).toFixed(2)}
              </TableCell>
            </TableRow>
          </TableFooter>
        )}
      </Table>

      {/* Controles de paginação */}
      <div className="flex items-center justify-between mt-4">
        <span className="text-muted-foreground">
          Página {currentPage} de {totalPages}
        </span>
        <div className='flex gap-2'>

        <Button size="sm" onClick={handlePrevious} disabled={currentPage === 1}>
          Anterior
        </Button>
        <Button size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
          Próximo
        </Button>
        </div>
      </div>
    </div>
  )
}

function statusColor(status: Return['status']) {
  switch (status) {
    case 'Pendente':
      return 'text-orange-700 bg-orange-100 border-orange-300'
    case 'Aprovado':
      return 'text-green-700 bg-green-100 border-green-300'
    case 'Recusado':
      return 'text-red-700 bg-red-100 border-red-300'
    default:
      return ''
  }
}
