import EstoquePage from '@/components/dashboard-v2/pages/EstoquePage';
import { ProductServiceEstoque } from '@/services/products/productEstoqueService';

import { tiposDeProdutosService } from '@/services/TiposDeProdutosService';

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export default async function Page(props: {searchParams:SearchParams}) {
  //Paginação
  const page =  (await props.searchParams).page || '1'
  const perPage = (await props.searchParams).perPage || '10'
  
  const productService = new ProductServiceEstoque();
  const [responseProducts, categories, tiposDeProdutos, atributosVariante] =
    await Promise.all([
      productService.getProducts(+page, +perPage),
      productService.getCategories(),
      tiposDeProdutosService.getAll(),
      productService.getAtributosVarianteByBusiness(),
    ]);

  
  return (
    <EstoquePage
      responseProducts={responseProducts}
      categories={categories}
      tiposDeProdutos={tiposDeProdutos}
      atributosVariante={atributosVariante}
      page={+page}
      perPage={+perPage}
    />
  );
}
