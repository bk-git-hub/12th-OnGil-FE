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

  const safePage =
    Number.isFinite(Number(page)) && Number(page) >= 0 ? Number(page) : 0;

  // subCategoryId 유효성 검증
  const parsedCategoryId = Number(subCategoryId);
  const safeCategoryId =
    Number.isFinite(parsedCategoryId) && parsedCategoryId > 0
      ? parsedCategoryId
      : null;

  if (safeCategoryId === null) {
    throw new Error('Invalid category ID');
  }

  const result = await api.get<ProductSearchResult>('/products', {
    params: {
      categoryId: safeCategoryId,
      sortType: safeSortType,
      page: safePage,
      size: 20,
    },
  });

  const totalElements = result.products.totalElements;

  return (
    <ProductList
      products={result.products.content}
      totalElements={totalElements}
    />
  );
}
