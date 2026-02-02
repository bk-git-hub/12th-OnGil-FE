import { api } from '@/lib/api-client';
import { ProductSearchResult } from '@/types/domain/product';
import { ProductSortType } from '@/types/enums';
import { ProductList } from './product-list';

interface ProductListContainerProps {
  params: Promise<{ parentId: string; id: string }>;
  sortType?: ProductSortType;
  page?: number;
}

export default async function ProductListContainer({
  params,
  sortType = ProductSortType.POPULAR,
  page = 0,
}: ProductListContainerProps) {
  const { id: subCategoryId } = await params;

  const result = await api.get<ProductSearchResult>('/products', {
    params: {
      categoryId: Number(subCategoryId),
      sortType,
      page,
      size: 20,
      sort: ['string'] as string[],
    },
  });

  console.log(result);

  return (
    <ProductList
      products={result.products.content}
      totalElements={result.products.page.totalElements}
    />
  );
}
