import { api } from '@/lib/api-client';
import { ProductSearchResult } from '@/types/domain/product';
import { ProductSortType } from '@/types/enums';
import ProductList from './product-list';
import { getMyWishlist } from '@/app/actions/wishlist';

interface ProductListContainerProps {
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

export default async function ProductListContainer({
  params,
  searchParams,
}: ProductListContainerProps) {
  const { parentId, id: subCategoryId } = await params;
  const {
    sortType = ProductSortType.POPULAR,
    page = '0',
    clothingSizes,
    priceRange,
    brandIds,
  } = await searchParams;

  // 쿼리 파라미터 검증
  const validSortTypes = Object.values(ProductSortType);
  const safeSortType = validSortTypes.includes(sortType as ProductSortType)
    ? (sortType as ProductSortType)
    : ProductSortType.POPULAR;

  const safePage =
    Number.isFinite(Number(page)) && Number(page) >= 0 ? Number(page) : 0;
  const safeClothingSizes = normalizeArray(clothingSizes).filter((size) =>
    ['XS', 'S', 'M', 'L', 'XL'].includes(size),
  );
  const safeBrandIds = normalizeArray(brandIds).filter((value) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) && parsed > 0;
  });
  const rawPriceRange = normalizePriceRange(priceRange);
  const safePriceRange = PRICE_RANGE_PATTERN.test(rawPriceRange)
    ? rawPriceRange
    : '';

  // subCategoryId 유효성 검증
  const parsedCategoryId = Number(subCategoryId);
  const safeCategoryId =
    Number.isFinite(parsedCategoryId) && parsedCategoryId > 0
      ? parsedCategoryId
      : null;

  if (safeCategoryId === null) {
    throw new Error('Invalid category ID');
  }

  const [result, wishlistItems] = await Promise.all([
    api.get<ProductSearchResult>('/products', {
      params: {
        categoryId: safeCategoryId,
        sortType: safeSortType,
        page: safePage,
        size: 36,
        clothingSizes:
          safeClothingSizes.length > 0 ? safeClothingSizes : undefined,
        priceRange: safePriceRange || undefined,
        brandIds: safeBrandIds.length > 0 ? safeBrandIds : undefined,
      },
    }),
    getMyWishlist(),
  ]);

  const wishlistByProductId = new Map(
    wishlistItems.map((item) => [item.productId, item.wishlistId]),
  );
  const productsWithWishlist = result.products.content.map((product) => ({
    ...product,
    isLiked: wishlistByProductId.has(product.id),
    wishlistId: wishlistByProductId.get(product.id),
  }));

  const totalElements = result.products.totalElements;

  return (
    <ProductList
      products={productsWithWishlist}
      totalElements={totalElements}
      productDetailFrom={`/category/${parentId}/${subCategoryId}`}
      showWishlistButton
    />
  );
}
