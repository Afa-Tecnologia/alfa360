'use client';

import { useEffect, useState } from 'react';
import { useCustomerStore, type Customer } from '@/stores/customer-store';
import { Button } from '@/components/ui/button';
import { CreateClient } from './modals/Create-Clients';

import { TableViewClient } from './TableClients';
import { SearchInput } from './SearchInputClients';
import { FilterDialog } from './modals/FilterClientModal';
import { Filter, RefreshCcw } from 'lucide-react';
import ClientesLoading from './ClientLoading';
import GetClients from '@/services/clientes/GetClients';
import { refreshClients } from '@/services/clientes/refreshClients';

export default function ClientesPage() {
  const { customers, setCustomers } = useCustomerStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const [filterOptions, setFilterOptions] = useState({
    cpf: '',
    email: '',
  });
  const [filteredCustomers, setFilteredCustomers] = useState(customers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClients = async () => {
      const customersData = await GetClients();
      setCustomers(customersData);
      setFilteredCustomers(customersData);
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);
    };
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = customers.filter((customer) => {
      const nameMatches = searchTerm
        ? `${customer.name} ${customer.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        : true;

      const cpfMatches = filterOptions.cpf
        ? customer.cpf.includes(filterOptions.cpf)
        : true;

      const emailMatches = filterOptions.email
        ? customer.email
            .toLowerCase()
            .includes(filterOptions.email.toLowerCase())
        : true;

      return nameMatches && cpfMatches && emailMatches;
    });

    setFilteredCustomers(filtered);
  }, [searchTerm, filterOptions, customers]);

  const applyFilters = () => {
    setIsFilterDialogOpen(false);
  };

  return (
    <>
      <div className="p-6 space-y-6">
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold">Clientes</h1>
          <p className="text-muted-foreground">
            Gerencie os clientes da sua loja.
          </p>
        </div>
        <div className="flex justify-between items-center">
          <SearchInput searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                refreshClients(setCustomers, setFilteredCustomers, setIsLoading)
              }
            >
              <RefreshCcw className="h-4 w-4" />
              <span className="sr-only">Atualizar Lista</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsFilterDialogOpen(true)}
              className={
                filterOptions.cpf || filterOptions.email ? 'bg-primary/10' : ''
              }
            >
              <Filter className="h-4 w-4" />
              <span className="sr-only">Filtros</span>
            </Button>
            {/* Dialog Create new client */}
            <CreateClient />
          </div>
        </div>

        {/* Section Table Clients */}
        {isLoading ? (
          <ClientesLoading />
        ) : (
          <TableViewClient customers={filteredCustomers} />
        )}
        {/* Dialog para filtros */}
        <FilterDialog
          isOpen={isFilterDialogOpen}
          setIsOpen={setIsFilterDialogOpen}
          filterOptions={filterOptions}
          setFilterOptions={setFilterOptions}
          applyFilters={applyFilters}
        />
      </div>
    </>
  );
}
