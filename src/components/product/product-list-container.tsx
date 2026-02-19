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

export default async function ProductListContainer({
  params,
  searchParams,
}: ProductListContainerProps) {
  const { parentId, id: subCategoryId } = await params;
  const {
    sortType = ProductSortType.POPULAR,
    page = '0',
    clothingSize,
    priceRange,
  } = await searchParams;

  // 쿼리 파라미터 검증
  const validSortTypes = Object.values(ProductSortType);
  const safeSortType = validSortTypes.includes(sortType as ProductSortType)
    ? (sortType as ProductSortType)
    : ProductSortType.POPULAR;

  const safePage =
    Number.isFinite(Number(page)) && Number(page) >= 0 ? Number(page) : 0;
  const safeClothingSize = normalizeArray(clothingSize).filter((size) =>
    ['XS', 'S', 'M', 'L', 'XL'].includes(size),
  );
  const safePriceRange = normalizeArray(priceRange).filter((price) =>
    PRICE_OPTIONS.includes(price as (typeof PRICE_OPTIONS)[number]),
  );

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
        clothingSize: safeClothingSize.length > 0 ? safeClothingSize : undefined,
        priceRange: safePriceRange.length > 0 ? safePriceRange : undefined,
        // 1차 구현에서는 brandId 연동 없이 브랜드 UI/URL 상태만 제공합니다.
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
