import { getSubCategories } from '@/app/actions/category';
import { api } from '@/lib/api-client';
import { ProductSearchResult } from '@/types/domain/product';
import { ProductSortType } from '@/types/enums';
import { ProductFilterBar } from './product-filter-bar';

interface ProductFilterBarContainerProps {
  params: Promise<{ parentId: string; id: string }>;
  searchParams: Promise<{
    sortType?: string;
    page?: string;
    clothingSize?: string | string[];
    priceRange?: string | string[];
    brand?: string | string[];
  }>;
}

const PRICE_OPTIONS = [
  '5만원 이하',
  '5-10만원',
  '10-15만원',
  '15-20만원',
  '20만원 이상',
] as const;

function normalizeArray(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value.filter((item) => item.trim().length > 0);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value];
  }
  return [];
}

export default async function ProductFilterBarContainer({
  params,
  searchParams,
}: ProductFilterBarContainerProps) {
  const [{ parentId, id: subCategoryId }, query] = await Promise.all([
    params,
    searchParams,
  ]);

  const parsedCategoryId = Number(subCategoryId);
  const parsedParentId = Number(parentId);
  const safeCategoryId =
    Number.isFinite(parsedCategoryId) && parsedCategoryId > 0
      ? parsedCategoryId
      : null;

  if (safeCategoryId === null) {
    return <ProductFilterBar parentCategoryName="" availableBrands={[]} />;
  }

  const sortValues = Object.values(ProductSortType);
  const safeSortType = sortValues.includes(query.sortType as ProductSortType)
    ? (query.sortType as ProductSortType)
    : ProductSortType.POPULAR;

  const sizeOptions = normalizeArray(query.clothingSize).filter((size) =>
    ['XS', 'S', 'M', 'L', 'XL'].includes(size),
  );

  const priceOptions = normalizeArray(query.priceRange).filter((price) =>
    PRICE_OPTIONS.includes(price as (typeof PRICE_OPTIONS)[number]),
  );

  const [subCategories, result] = await Promise.all([
    Number.isFinite(parsedParentId)
      ? getSubCategories(parsedParentId)
      : Promise.resolve([]),
    api.get<ProductSearchResult>('/products', {
      params: {
        categoryId: safeCategoryId,
        sortType: safeSortType,
        page: 0,
        size: 36,
        clothingSize: sizeOptions.length > 0 ? sizeOptions : undefined,
        priceRange: priceOptions.length > 0 ? priceOptions : undefined,
      },
    }),
  ]);

  const parentCategoryName = subCategories[0]?.parentCategoryName ?? '';
  const availableBrands = Array.from(
    new Set(
      result.products.content
        .map((product) => product.brandName.trim())
        .filter((brandName) => brandName.length > 0),
    ),
  ).sort((a, b) => a.localeCompare(b, 'ko'));

  return (
    <ProductFilterBar
      parentCategoryName={parentCategoryName}
      availableBrands={availableBrands}
    />
  );
}
