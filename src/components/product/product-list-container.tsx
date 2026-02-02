import { api } from '@/lib/api-client';
import { ProductSearchResult } from '@/types/domain/product';
import { ProductSortType } from '@/types/enums';
import { ProductList } from './product-list';

interface ProductListContainerProps {
  params: Promise<{ parentId: string; id: string }>;
  searchParams: Promise<{ sortType?: string; page?: string }>;
}

export default async function ProductListContainer({
  params,
  searchParams,
}: ProductListContainerProps) {
  const { id: subCategoryId } = await params;
  const { sortType = ProductSortType.POPULAR, page = '0' } = await searchParams;

  const result = await api.get<ProductSearchResult>('/products', {
    params: {
      categoryId: Number(subCategoryId),
      sortType,
      page: Number(page),
      size: 20,
      sort: ['string'] as string[],
    },
  });

  console.log(result);

  const totalElements = result.products.page.totalElements;

  return (
    <ProductList products={result.products.content} totalElements={totalElements} />
  );
}
