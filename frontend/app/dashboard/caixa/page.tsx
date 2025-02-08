import { api } from '@/app/api/api';
import Caixa from '@/components/pages/Caixa';
import { IStatus } from '@/types/auth';
import { caixaService } from '@/utils/caixaService';

export default async function Page() {
  return <Caixa />;
}
