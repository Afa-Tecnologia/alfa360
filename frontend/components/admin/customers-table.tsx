"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Eye, MoreVertical, Mail, ShoppingBag } from "lucide-react"
import Link from "next/link"

export function CustomersTable() {
  // Normalmente, buscaríamos esses dados do backend
  const clientes = [
    {
      id: "1",
      nome: "Maria Silva",
      email: "maria.silva@exemplo.com",
      telefone: "(11) 98765-4321",
      dataCadastro: "15/01/2024",
      totalPedidos: 8,
      valorGasto: 2350.5,
      status: "Ativo",
    },
    {
      id: "2",
      nome: "João Santos",
      email: "joao.santos@exemplo.com",
      telefone: "(11) 91234-5678",
      dataCadastro: "20/01/2024",
      totalPedidos: 3,
      valorGasto: 850.7,
      status: "Ativo",
    },
    {
      id: "3",
      nome: "Ana Oliveira",
      email: "ana.oliveira@exemplo.com",
      telefone: "(21) 99876-5432",
      dataCadastro: "05/02/2024",
      totalPedidos: 5,
      valorGasto: 1250.3,
      status: "Ativo",
    },
    {
      id: "4",
      nome: "Carlos Pereira",
      email: "carlos.pereira@exemplo.com",
      telefone: "(11) 97654-3210",
      dataCadastro: "10/02/2024",
      totalPedidos: 2,
      valorGasto: 520.9,
      status: "Ativo",
    },
    {
      id: "5",
      nome: "Fernanda Lima",
      email: "fernanda.lima@exemplo.com",
      telefone: "(21) 98765-1234",
      dataCadastro: "25/02/2024",
      totalPedidos: 1,
      valorGasto: 329.9,
      status: "Ativo",
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cliente</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Data de Cadastro</TableHead>
            <TableHead>Pedidos</TableHead>
            <TableHead>Valor Gasto</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clientes.map((cliente) => (
            <TableRow key={cliente.id}>
              <TableCell>
                <div>
                  <p className="font-medium">{cliente.nome}</p>
                  <p className="text-xs text-muted-foreground">#{cliente.id}</p>
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <p>{cliente.email}</p>
                  <p className="text-sm text-muted-foreground">{cliente.telefone}</p>
                </div>
              </TableCell>
              <TableCell>{cliente.dataCadastro}</TableCell>
              <TableCell>{cliente.totalPedidos}</TableCell>
              <TableCell>R$ {cliente.valorGasto.toFixed(2)}</TableCell>
              <TableCell>
                <Badge variant="outline" className="text-green-500 border-green-500">
                  {cliente.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Ações</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href={`/admin/clientes/${cliente.id}`}>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver detalhes
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <Mail className="h-4 w-4 mr-2" />
                      Enviar e-mail
                    </DropdownMenuItem>
                    <Link href={`/admin/clientes/${cliente.id}/pedidos`}>
                      <DropdownMenuItem>
                        <ShoppingBag className="h-4 w-4 mr-2" />
                        Ver pedidos
                      </DropdownMenuItem>
                    </Link>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

