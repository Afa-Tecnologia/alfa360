import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import {
  SalesReportFilters,
  SalesSummary,
  CategorySales,
  ProductSales,
  CommissionSummary,
  Commission,
} from '@/types/reports';
import { reportService } from '@/lib/services/ReportService';

export function useReports() {
  const [activeTab, setActiveTab] = useState('vendas');
  const [startDate, setStartDate] = useState<Date>(startOfMonth(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfMonth(new Date()));
  const [selectedVendorId, setSelectedVendorId] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');
  const [period, setPeriod] = useState<'day' | 'week' | 'month'>('month');

  const [salesSummary, setSalesSummary] = useState<SalesSummary | null>(null);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);
  const [topProducts, setTopProducts] = useState<ProductSales[]>([]);
  const [commissionSummary, setCommissionSummary] = useState<CommissionSummary>(
    {
      vendedor_id: 0,
      vendedor: undefined,
      comissao_total: 0,
      comissoes: [],
    }
  );
  const [loading, setLoading] = useState({
    summary: true,
    categories: true,
    products: true,
    commissions: true,
  });

  // Função para buscar dados de acordo com os filtros
  const fetchData = async () => {
    setLoading({
      summary: true,
      categories: true,
      products: true,
      commissions: true,
    });

    const filters: SalesReportFilters = {
      startDate: format(startDate, 'yyyy-MM-dd'),
      endDate: format(endDate, 'yyyy-MM-dd'),
      vendorId:
        selectedVendorId && selectedVendorId !== 'todos'
          ? parseInt(selectedVendorId)
          : undefined,
      categoryId:
        selectedCategoryId && selectedCategoryId !== 'todas'
          ? parseInt(selectedCategoryId)
          : undefined,
    };

    try {
      // Fetch sales summary
      const summary = await reportService.getSalesSummary(filters);
      setSalesSummary(summary);
      setLoading((prev) => ({ ...prev, summary: false }));

      // Fetch sales by category
      const categories = await reportService.getSalesByCategory(filters);
      setCategorySales(categories);
      setLoading((prev) => ({ ...prev, categories: false }));

      // Fetch top products
      const products = await reportService.getTopProducts(filters, 10);
      setTopProducts(products);
      setLoading((prev) => ({ ...prev, products: false }));

      // Fetch commissions based on filter selection
      try {
        if (selectedVendorId && selectedVendorId !== 'todos') {
          // Caso específico: vendedor selecionado
          const vendorId = parseInt(selectedVendorId);
          console.log('Selected Vendor ID:', selectedVendorId);

          if (!isNaN(vendorId)) {
            const commissionData =
              await reportService.getCommissionsByVendor(vendorId);
            console.log(
              'Comissões recebidas da API para vendedor específico:',
              commissionData
            );

            setCommissionSummary({
              ...commissionData,
              dataInicial: format(startDate, 'yyyy-MM-dd'),
              dataFinal: format(endDate, 'yyyy-MM-dd'),
            });
          } else {
            console.error('ID do vendedor inválido:', selectedVendorId);
            throw new Error('ID do vendedor inválido');
          }
        } else {
          // Caso "todos": buscar todas as comissões e consolidar
          console.log('Buscando comissões para todos os vendedores');
          const allCommissions = await reportService.getAllCommissions(
            format(startDate, 'yyyy-MM-dd'),
            format(endDate, 'yyyy-MM-dd')
          );
          console.log('Comissões de todos os vendedores:', allCommissions);

          // Consolidar os dados de comissões de todos os vendedores
          const totalComissao = allCommissions.reduce(
            (total: number, c: Commission) => total + c.valor,
            0
          );

          setCommissionSummary({
            vendedor_id: 0,
            vendedor: { id: 0, name: 'Todos os vendedores' },
            comissao_total: totalComissao,
            comissoes: allCommissions,
            dataInicial: format(startDate, 'yyyy-MM-dd'),
            dataFinal: format(endDate, 'yyyy-MM-dd'),
          });
        }
      } catch (error) {
        console.error('Erro ao buscar comissões:', error);
        setCommissionSummary({
          vendedor_id: 0,
          vendedor: undefined,
          comissao_total: 0,
          comissoes: [],
          dataInicial: format(startDate, 'yyyy-MM-dd'),
          dataFinal: format(endDate, 'yyyy-MM-dd'),
        });
      } finally {
        setLoading((prev) => ({ ...prev, commissions: false }));
      }
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      setLoading({
        summary: false,
        categories: false,
        products: false,
        commissions: false,
      });
    }
  };

  // Buscar dados quando os filtros mudarem
  useEffect(() => {
    fetchData();
  }, [startDate, endDate, selectedVendorId, selectedCategoryId, period]);

  // Formatar valor monetário
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return {
    activeTab,
    setActiveTab,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    selectedVendorId,
    setSelectedVendorId,
    selectedCategoryId,
    setSelectedCategoryId,
    period,
    setPeriod,
    salesSummary,
    categorySales,
    topProducts,
    commissionSummary,
    loading,
    formatCurrency,
    fetchData,
  };
}
