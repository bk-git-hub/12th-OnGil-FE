import {
  getProductReviewsAction,
  type ProductReviewsQuery,
} from '@/app/actions/review';
import type { ProductReviewListItem } from '@/types/domain/review';

const inFlightRequests = new Map<string, Promise<ProductReviewListItem[]>>();

function normalizeValues(value?: string | string[]) {
  if (!value) return [];
  return (Array.isArray(value) ? value : [value])
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function applyClientOptionFilter(
  reviews: ProductReviewListItem[],
  query: ProductReviewsQuery,
) {
  const sizeFilters = normalizeValues(query.size);
  const colorFilters = normalizeValues(query.color);

  if (sizeFilters.length === 0 && colorFilters.length === 0) {
    return reviews;
  }

  const filtered = reviews.filter((review) => {
    const selectedSize =
      review.purchaseOption?.selectedSize?.trim().toLowerCase() ?? '';
    const selectedColor =
      review.purchaseOption?.selectedColor?.trim().toLowerCase() ?? '';

    // 옵션 필터가 걸린 상태에서 source 값이 없으면 매칭 실패로 처리한다.
    const hasSizeSource = selectedSize.length > 0;
    const hasColorSource = selectedColor.length > 0;

    const sizeMatched =
      sizeFilters.length === 0 ||
      (hasSizeSource && sizeFilters.includes(selectedSize));
    const colorMatched =
      colorFilters.length === 0 ||
      (hasColorSource && colorFilters.includes(selectedColor));

    return sizeMatched && colorMatched;
  });

  console.log('[reviews:list] client-filter', {
    size: query.size,
    color: query.color,
    before: reviews.length,
    after: filtered.length,
  });

  return filtered;
}

export async function fetchAllProductReviews(
  productId: number,
  query: ProductReviewsQuery,
): Promise<ProductReviewListItem[]> {
  const queryKey = JSON.stringify({ productId, ...query });
  const inFlight = inFlightRequests.get(queryKey);
  if (inFlight) {
    return inFlight;
  }

  const request = (async () => {
    const pageSize = 100;
    const maxPages = 20;
    let page = 0;
    let hasMore = true;
    const allReviews: ProductReviewListItem[] = [];

    while (hasMore && page < maxPages) {
      const response = await getProductReviewsAction(productId, {
        ...query,
        page,
        pageSize,
      });
      allReviews.push(...response.content);
      if (response.content.length === 0) {
        hasMore = false;
        break;
      }
      hasMore = !response.last;
      page += 1;
    }

    if (hasMore) {
      console.warn('리뷰 통계 집계가 최대 페이지 제한에 도달했습니다.', {
        productId,
        query,
        maxPages,
      });
    }

    return applyClientOptionFilter(allReviews, query);
  })();

  inFlightRequests.set(queryKey, request);

  try {
    return await request;
  } finally {
    inFlightRequests.delete(queryKey);
  }
}
