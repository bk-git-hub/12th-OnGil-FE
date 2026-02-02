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

  // 쿼리 파라미터 검증
  const validSortTypes = Object.values(ProductSortType);
  const safeSortType = validSortTypes.includes(sortType as ProductSortType)
    ? (sortType as ProductSortType)
    : ProductSortType.POPULAR;

  const safePage = Number.isFinite(Number(page)) && Number(page) >= 0 ? Number(page) : 0;

  const result = await api.get<ProductSearchResult>('/products', {
    params: {
      categoryId: Number(subCategoryId),
      sortType: safeSortType,
      page: safePage,
      size: 20,
    },
  });

  const totalElements = result.products.page.totalElements;

  return (
    <ProductList products={result.products.content} totalElements={totalElements} />
  );
}
