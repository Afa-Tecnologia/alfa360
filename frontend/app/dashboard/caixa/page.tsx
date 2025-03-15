import { api } from '@/app/api/api';
import Caixa from '@/components/pages/Caixa';
import { IMovimentacoes } from '@/types/caixa';


export default async function Page() {
  // const fetchCaixaMovimentacoes = async () =>{
  //   try {
  //     const response = await api.get('/caixa/movimentacoes')
  //     return response.data as IMovimentacoes[]
  //   } catch (e){
  //     console.log(e);
  //     return [];
  //   }
  // }

  // const caixaMovimentacoes = await fetchCaixaMovimentacoes();
  return <Caixa />;
}
