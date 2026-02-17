import { api } from '@/lib/api-client';
import {
  ProductWithReviewStats,
  WritableReviewItem,
} from '@/types/domain/review';
import ReviewManagementContent from './review-management-content';

interface MyReviewsFallbackResponse {
  content?: Array<ProductWithReviewStats | WrittenReviewApiItem>;
  page?: {
    totalElements?: number;
    totalPages?: number;
    number?: number;
    size?: number;
  };
  data?: MyReviewsFallbackResponse;
}

interface WrittenReviewApiItem {
  reviewId?: number;
  purchaseOption?: string;
  rating?: number;
  helpfulCount?: number;
  product?: {
    productId?: number;
    productName?: string;
    price?: number;
    discountRate?: number;
    finalPrice?: number;
    thumbnailImageUrl?: string;
    brandName?: string;
    productType?: string;
    viewCount?: number;
    purchaseCount?: number;
    reviewCount?: number;
    reviewRating?: number;
  };
}

function normalizeWrittenReviewItem(
  item: ProductWithReviewStats | WrittenReviewApiItem,
): ProductWithReviewStats | null {
  if (
    'id' in item &&
    typeof item.id === 'number' &&
    'name' in item &&
    typeof item.name === 'string'
  ) {
    return item as ProductWithReviewStats;
  }

  if (!('product' in item) || !item.product) {
    return null;
  }

  const product = item.product;
  if (
    typeof product.productId !== 'number' ||
    typeof product.productName !== 'string' ||
    typeof product.brandName !== 'string'
  ) {
    return null;
  }

  return {
    id: product.productId,
    reviewId: typeof item.reviewId === 'number' ? item.reviewId : undefined,
    purchaseOption:
      typeof item.purchaseOption === 'string' ? item.purchaseOption : undefined,
    name: product.productName,
    price: typeof product.price === 'number' ? product.price : 0,
    discountRate: typeof product.discountRate === 'number' ? product.discountRate : 0,
    finalPrice: typeof product.finalPrice === 'number' ? product.finalPrice : 0,
    thumbnailImageUrl: product.thumbnailImageUrl ?? '',
    brandName: product.brandName,
    productType: product.productType ?? '',
    viewCount: typeof product.viewCount === 'number' ? product.viewCount : 0,
    purchaseCount:
      typeof product.purchaseCount === 'number' ? product.purchaseCount : 0,
    reviewCount:
      typeof product.reviewCount === 'number' ? product.reviewCount : 0,
    reviewRating:
      typeof product.reviewRating === 'number'
        ? product.reviewRating
        : typeof item.rating === 'number'
          ? item.rating
          : 0,
  };
}

export default async function ReviewManagementContainer() {
  const [pendingReviews, writtenReviewsPage] = await Promise.all([
    api.get<WritableReviewItem[]>('/users/me/reviews/pending'),
    api.get<MyReviewsFallbackResponse | ProductWithReviewStats[]>(
      '/users/me/reviews',
      {
        params: {
          page: 0,
          pageSize: 10,
        },
      },
    ),
  ]);

  const writtenResponse =
    !Array.isArray(writtenReviewsPage) &&
    writtenReviewsPage &&
    typeof writtenReviewsPage === 'object' &&
    writtenReviewsPage.data &&
    typeof writtenReviewsPage.data === 'object'
      ? writtenReviewsPage.data
      : writtenReviewsPage;
  const writtenReviews = Array.isArray(writtenResponse)
    ? []
    : Array.isArray(writtenResponse.content)
      ? writtenResponse.content
          .map(normalizeWrittenReviewItem)
          .filter((item): item is ProductWithReviewStats => item !== null)
      : [];

  const writtenTotalCount =
    !Array.isArray(writtenResponse) &&
    typeof writtenResponse.page?.totalElements === 'number'
      ? writtenResponse.page.totalElements
      : undefined;

  if (writtenTotalCount === undefined) {
    throw new Error(
      '[reviews] /users/me/reviews 응답에 page.totalElements가 없습니다.',
    );
  }

  return (
    <ReviewManagementContent
      pendingReviews={pendingReviews}
      writtenReviews={writtenReviews}
      writtenTotalCount={writtenTotalCount}
    />
  );
}
