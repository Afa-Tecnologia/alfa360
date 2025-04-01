import { api } from '@/app/api/api';
import { getUrl } from '@/lib/get-url';
import {
  CategorySales,
  Commission,
  CommissionSummary,
  ProductSales,
  RevenueByPeriod,
  SalesReportFilters,
  SalesSummary,
} from '@/types/reports';

class ReportService {
  private path: string = '/relatorios';

  async getSalesSummary(filters?: SalesReportFilters): Promise<SalesSummary> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.startDate)
        queryParams.append('data_inicial', filters?.startDate);
      if (filters?.endDate) queryParams.append('data_final', filters.endDate);
      if (filters?.vendorId)
        queryParams.append('vendedor_id', filters.vendorId.toString());
      if (filters?.categoryId)
        queryParams.append('categoria_id', filters.categoryId.toString());

      const url = getUrl(`${this.path}/resumo?${queryParams.toString()}`);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar resumo de vendas:', error);
      throw error;
    }
  }

  // Buscar vendas por categoria
  async getSalesByCategory(
    filters?: SalesReportFilters
  ): Promise<CategorySales[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.startDate)
        queryParams.append('data_inicial', filters.startDate);
      if (filters?.endDate) queryParams.append('data_final', filters.endDate);
      if (filters?.vendorId)
        queryParams.append('vendedor_id', filters.vendorId.toString());

      const url = getUrl(
        `${this.path}/por-categoria?${queryParams.toString()}`
      );
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar vendas por categoria:', error);
      throw error;
    }
  }

  // Buscar produtos mais vendidos
  async getTopProducts(
    filters?: SalesReportFilters,
    limit: number = 10
  ): Promise<ProductSales[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.startDate)
        queryParams.append('data_inicial', filters.startDate);
      if (filters?.endDate) queryParams.append('data_final', filters.endDate);
      if (filters?.vendorId)
        queryParams.append('vendedor_id', filters.vendorId.toString());
      if (filters?.categoryId)
        queryParams.append('categoria_id', filters.categoryId.toString());
      queryParams.append('limit', limit.toString());

      const url = getUrl(
        `${this.path}/produtos-mais-vendidos?${queryParams.toString()}`
      );
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos mais vendidos:', error);
      throw error;
    }
  }

  // Buscar comissões do mês atual
  async getCurrentMonthCommissions(): Promise<Commission[]> {
    try {
      const url = getUrl(`${this.path}/comissoes`);
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar comissões do mês atual:', error);
      throw error;
    }
  }

  // Buscar comissões por vendedor
  async getCommissionsByVendor(vendorId: number): Promise<CommissionSummary> {
    try {
      const url = getUrl(`${this.path}/comissoes/vendedor/${vendorId}`);
      const response = await api.get(url);

      console.log('Resposta original da API:', response.data);

      // Transformamos a resposta da API no formato esperado pelo frontend
      if (response.data && response.data.success && response.data.data) {
        const apiData = response.data.data;

        const result = {
          vendedor_id: vendorId,
          vendedor: apiData.vendedor,
          comissao_total: apiData.total_comissoes || 0,
          comissoes: apiData.comissoes || [],
        };

        console.log('Dados transformados:', result);
        return result;
      } else {
        // Caso a estrutura seja diferente, retornamos um objeto vazio
        console.log('Estrutura de dados inesperada na resposta da API');
        return {
          vendedor_id: vendorId,
          comissao_total: 0,
          comissoes: [],
        };
      }
    } catch (error) {
      console.error(`Erro ao buscar comissões do vendedor ${vendorId}:`, error);
      throw error;
    }
  }

  // Buscar comissões por vendedor e período
  async getCommissionsByVendorAndDate(
    vendorId: number,
    startDate: string,
    endDate: string
  ): Promise<Commission[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('data_inicial', startDate);
      queryParams.append('data_final', endDate);

      const url = getUrl(
        `${this.path}/comissoes/vendedor/${vendorId}/comissoes?${queryParams.toString()}`
      );
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error(
        `Erro ao buscar comissões do vendedor ${vendorId} por período:`,
        error
      );
      throw error;
    }
  }

  // Buscar receita por período (dia, semana, mês)
  async getRevenueByPeriod(
    period: 'day' | 'week' | 'month',
    filters?: SalesReportFilters
  ): Promise<RevenueByPeriod[]> {
    try {
      const queryParams = new URLSearchParams();

      if (filters?.startDate)
        queryParams.append('data_inicial', filters.startDate);
      if (filters?.endDate) queryParams.append('data_final', filters.endDate);
      if (filters?.vendorId)
        queryParams.append('vendedor_id', filters.vendorId.toString());
      queryParams.append('period', period);

      const url = getUrl(
        `${this.path}/receita-por-periodo?${queryParams.toString()}`
      );
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar receita por período:', error);
      throw error;
    }
  }

  // Buscar todas as comissões por período
  async getAllCommissions(
    startDate: string,
    endDate: string
  ): Promise<Commission[]> {
    try {
      const queryParams = new URLSearchParams();
      queryParams.append('data_inicial', startDate);
      queryParams.append('data_final', endDate);

      const url = getUrl(`${this.path}/comissoes?${queryParams.toString()}`);
      console.log('Buscando todas as comissões:', url);

      const response = await api.get(url);

      // Verificar se a resposta segue o formato esperado
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      } else if (Array.isArray(response.data)) {
        return response.data;
      } else {
        console.log(
          'Formato de resposta inesperado para comissões:',
          response.data
        );
        return [];
      }
    } catch (error) {
      console.error('Erro ao buscar todas as comissões:', error);
      return [];
    }
  }
}

// Exporta uma instância única do serviço
export const reportService = new ReportService();
