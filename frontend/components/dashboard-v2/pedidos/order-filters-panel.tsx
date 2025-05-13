'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CalendarIcon, SearchIcon } from 'lucide-react';
import { OrderFilters, OrderStatus } from '@/types/order';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { paymentMethodService } from '@/lib/services/PaymentMethodService';
import { PaymentMethod } from '@/stores/paymentMethodStore';
import { userService } from '@/services/userService';
import { motion } from 'framer-motion';

interface OrderFiltersPanelProps {
  filters: OrderFilters;
  onFilterChange: (filters: Partial<OrderFilters>) => void;
}

export function OrderFiltersPanel({
  filters,
  onFilterChange,
}: OrderFiltersPanelProps) {
  const [startDate, setStartDate] = useState<Date | undefined>(
    filters.startDate ? new Date(filters.startDate) : undefined
  );
  const [endDate, setEndDate] = useState<Date | undefined>(
    filters.endDate ? new Date(filters.endDate) : undefined
  );
  const [customerName, setCustomerName] = useState(filters.customerName || '');
  const [status, setStatus] = useState<OrderStatus | undefined>(filters.status);
  const [paymentMethod, setPaymentMethod] = useState<string | undefined>(
    filters.paymentMethod
  );
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [vendorId, setVendorId] = useState<number | undefined>(
    filters.vendorId
  );
  const [vendors, setVendors] = useState<{ id: number; name: string }[]>([]);

  // Buscar formas de pagamento
  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const methods = await paymentMethodService.getPaymentMethods();
        setPaymentMethods(methods);
      } catch (error) {
        console.error('Erro ao carregar formas de pagamento:', error);
      }
    };

    const fetchVendors = async () => {
      try {
        const response = await userService.getVendedores();
        setVendors(response);
      } catch (error) {
        console.error('Erro ao carregar vendedores:', error);
      }
    };

    fetchPaymentMethods();
    fetchVendors();
  }, []);

  const handleApplyFilters = () => {
    const newFilters = {
      startDate: startDate ? format(startDate, 'yyyy-MM-dd') : undefined,
      endDate: endDate ? format(endDate, 'yyyy-MM-dd') : undefined,
      customerName: customerName || undefined,
      status,
      paymentMethod,
      vendorId,
    };

    onFilterChange(newFilters);
  };

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setCustomerName('');
    setStatus(undefined);
    setPaymentMethod(undefined);
    setVendorId(undefined);

    onFilterChange({
      startDate: undefined,
      endDate: undefined,
      customerName: undefined,
      status: undefined,
      paymentMethod: undefined,
      vendorId: undefined,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="my-4 overflow-hidden">
        <CardContent className="p-4 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Data inicial */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="startDate">Data Inicial</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, 'dd/MM/yyyy', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Data final */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="endDate">Data Final</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, 'dd/MM/yyyy', { locale: ptBR })
                    ) : (
                      <span>Selecione uma data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Status */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={status}
                onValueChange={(value) => setStatus(value as OrderStatus)}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="Todos os status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pendente</SelectItem>
                  <SelectItem value="PAYMENT_CONFIRMED">
                    Pagamento Confirmado
                  </SelectItem>
                  <SelectItem value="PARTIAL_PAYMENT">
                    Pagamento Parcial
                  </SelectItem>
                  <SelectItem value="CONDITIONAL">Condicional</SelectItem>
                  <SelectItem value="ORDERED">Pedido Realizado</SelectItem>
                  <SelectItem value="CANCELLED">Cancelado</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Forma de Pagamento */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="paymentMethod">Forma de Pagamento</Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue placeholder="Todas as formas" />
                </SelectTrigger>
                <SelectContent>
                  {paymentMethods.map((method) => (
                    <SelectItem key={method.id} value={method.code}>
                      {method.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Cliente */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="customerName">Cliente</Label>
              <div className="relative">
                <SearchIcon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="customerName"
                  placeholder="Nome do cliente"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>

            {/* Vendedor */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="vendorId">Vendedor</Label>
              <Select
                value={vendorId?.toString()}
                onValueChange={(value) =>
                  setVendorId(value ? parseInt(value) : undefined)
                }
              >
                <SelectTrigger id="vendorId">
                  <SelectValue placeholder="Todos os vendedores" />
                </SelectTrigger>
                <SelectContent>
                  {vendors.map((vendor) => (
                    <SelectItem key={vendor.id} value={vendor.id.toString()}>
                      {vendor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
            <Button onClick={handleApplyFilters}>Aplicar Filtros</Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
