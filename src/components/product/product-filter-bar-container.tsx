import { getSubCategories } from '@/app/actions/category';
import { api } from '@/lib/api-client';
import { BrandWithProducts } from '@/types/domain/brand';
import { ProductSearchResult } from '@/types/domain/product';
import { ProductSortType } from '@/types/enums';
import { BrandFilterOption, ProductFilterBar } from './product-filter-bar';

interface ProductFilterBarContainerProps {
  params: Promise<{ parentId: string; id: string }>;
  searchParams: Promise<{
    sortType?: string;
    page?: string;
    clothingSizes?: string | string[];
    priceRange?: string | string[];
    brandIds?: string | string[];
  }>;
}

const PRICE_RANGE_PATTERN = /^\d+-\d+$/;

function normalizeBrandName(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, '');
}

function normalizeArray(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value.filter((item) => item.trim().length > 0);
  }
  if (typeof value === 'string' && value.trim().length > 0) {
    return [value];
  }
  return [];
}

function normalizePriceRange(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] ?? '';
  }
  return value ?? '';
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

  const sizeOptions = normalizeArray(query.clothingSizes).filter((size) =>
    ['XS', 'S', 'M', 'L', 'XL'].includes(size),
  );

  const rawPriceRange = normalizePriceRange(query.priceRange);
  const safePriceRange = PRICE_RANGE_PATTERN.test(rawPriceRange)
    ? rawPriceRange
    : '';

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
        clothingSizes: sizeOptions.length > 0 ? sizeOptions : undefined,
        priceRange: safePriceRange || undefined,
      },
    }),
  ]);

  const parentCategoryName = subCategories[0]?.parentCategoryName ?? '';
  const productItems = result.products.content as Array<{
    brandName: string;
    brandId?: number;
  }>;
  const brandsFromProducts = Array.from(
    new Set(
      productItems
        .map((product) => product.brandName.trim())
        .filter((brandName) => brandName.length > 0),
    ),
  );

  const recommendedBrands = await api
    .get<BrandWithProducts[]>('/brands/recommend', { params: { count: 200 } })
    .catch(() => []);

  const brandIdByNormalizedName = new Map<string, number>();
  productItems.forEach((product) => {
    const normalized = normalizeBrandName(product.brandName);
    if (!normalized) return;
    if (Number.isFinite(product.brandId) && (product.brandId as number) > 0) {
      brandIdByNormalizedName.set(normalized, product.brandId as number);
    }
  });
  recommendedBrands.forEach((brand) => {
    const normalized = normalizeBrandName(brand.name);
    if (!normalized || brandIdByNormalizedName.has(normalized)) return;
    brandIdByNormalizedName.set(normalized, brand.id);
  });

  const mappedFromProducts = brandsFromProducts
    .map((name) => {
      const id = brandIdByNormalizedName.get(normalizeBrandName(name));
      if (!id) return null;
      return { id, name };
    })
    .filter((item): item is BrandFilterOption => item !== null);

  const mappedFromRecommended: BrandFilterOption[] = recommendedBrands.map(
    (brand) => ({ id: brand.id, name: brand.name }),
  );

  const availableBrands = Array.from(
    new Map(
      [...mappedFromProducts, ...mappedFromRecommended].map((brand) => [
        String(brand.id),
        brand,
      ]),
    ).values(),
  ).sort((a, b) => a.name.localeCompare(b.name, 'ko'));

  return (
    <ProductFilterBar
      parentCategoryName={parentCategoryName}
      availableBrands={availableBrands}
    />
  );
}
