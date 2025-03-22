import GetClients from '@/services/clientes/GetClients';

export async function refreshClients(setCustomers: Function, setFilteredCustomers: Function, setIsLoading: Function) {
  setIsLoading(true);
  const customersData = await GetClients();
  setCustomers(customersData);
  setFilteredCustomers(customersData);
  setTimeout(() => {
    setIsLoading(false);
  }, 2000);
}
