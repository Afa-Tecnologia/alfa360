import { useState, useEffect } from 'react';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import {


  SalesReportFilters,
  SalesSummary,
  CategorySales,
  ProductSales,
  CommissionSummary

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
  const [commissionSummary, setCommissionSummary] =
    useState<CommissionSummary | null>(null);
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

      // Fetch commissions if vendor selected
      if (selectedVendorId && selectedVendorId !== 'todos') {
        const vendorId = parseInt(selectedVendorId);
        const commissions =
          await reportService.getCommissionsByVendor(vendorId);
        setCommissionSummary(commissions);
      } else {
        setCommissionSummary(null);
      }
      setLoading((prev) => ({ ...prev, commissions: false }));
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
