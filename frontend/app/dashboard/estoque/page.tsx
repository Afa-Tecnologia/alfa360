import { api } from '@/app/api/api';
import { fetchApi } from '@/app/api/fetch';
import EstoquePage from '@/components/pages/EstoquePage';

import { produtosService } from '@/utils/produtosService';
import { toast } from 'react-toastify';

export default async function Page() {
  return (
    <>
      <EstoquePage />
    </>
  );
}
