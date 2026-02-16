'use server';

import { redirect } from 'next/navigation';

import { ApiError, api } from '@/lib/api-client';
import { rethrowNextError } from '@/lib/server-action-utils';
import type {
  PageResponse,
  ProductReviewListItem,
  ReviewDetail,
  ReviewHelpfulData,
  ReviewStatsData,
} from '@/types/domain/review';

interface InitReviewResponseData {
  reviewId: number;
}

export interface ReviewStep1Request {
  clothingCategory: string;
  rating: number;
  sizeAnswer: string;
  colorAnswer: string;
  materialAnswer: string;
}

export interface ReviewStep1ResponseData {
  reviewId: number;
  needsSizeSecondaryQuestion: boolean;
  needsMaterialSecondaryQuestion: boolean;
  availableBodyParts: string[];
}

export interface ReviewStep2SizeRequest {
  fitIssueParts: string[];
}

export interface ReviewStep2MaterialRequest {
  featureTypes: string[];
}

export interface ReviewSubmitRequest {
  textReview: string;
  reviewImageUrls: string[];
  sizeReview: string[];
  materialReview: string[];
}

interface ActionResult<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface ProductReviewsQuery {
  reviewType?: 'INITIAL' | 'ONE_MONTH';
  size?: string | string[];
  color?: string | string[];
  sort?: 'BEST' | 'RECENT' | 'RATING_HIGH' | 'RATING_LOW';
  mySizeOnly?: boolean;
  page?: number;
  pageSize?: number;
}

const REVIEW_LIST_DEFAULT_PAGE_SIZE = 10;

function createEmptyReviewSummary(): ReviewStatsData {
  return {
    averageRating: 0,
    initialReviewCount: 0,
    oneMonthReviewCount: 0,
    sizeSummary: {
      category: '사이즈',
      totalCount: 0,
      topAnswer: null,
      topAnswerCount: 0,
      answerStats: [],
    },
    colorSummary: {
      category: '색감',
      totalCount: 0,
      topAnswer: null,
      topAnswerCount: 0,
      answerStats: [],
    },
    materialSummary: {
      category: '소재',
      totalCount: 0,
      topAnswer: null,
      topAnswerCount: 0,
      answerStats: [],
    },
  };
}

function createEmptyReviewPage(
  page = 0,
  pageSize = 10,
): PageResponse<ProductReviewListItem> {
  return {
    totalPages: 0,
    totalElements: 0,
    pageable: {
      paged: true,
      pageNumber: page,
      pageSize,
      offset: page * pageSize,
      sort: [],
      unpaged: false,
    },
    first: true,
    last: true,
    size: pageSize,
    content: [],
    number: page,
    sort: [],
    numberOfElements: 0,
    empty: true,
  };
}

export async function initPendingReviewAction(formData: FormData) {
  const rawOrderItemId = formData.get('orderItemId');
  const rawProductId = formData.get('productId');
  const orderItemId =
    typeof rawOrderItemId === 'string' ? Number(rawOrderItemId) : NaN;
  const productId =
    typeof rawProductId === 'string' ? Number(rawProductId) : NaN;

  if (!Number.isFinite(orderItemId)) {
    return;
  }

  const data = await api.post<InitReviewResponseData, Record<string, never>>(
    '/reviews/init',
    {},
    { params: { orderItemId } },
  );
  const searchParams = new URLSearchParams();
  searchParams.set('orderItemId', String(orderItemId));
  if (Number.isFinite(productId)) {
    searchParams.set('productId', String(productId));
  }

  redirect(`/review/write/${data.reviewId}?${searchParams.toString()}`);
}

export async function patchReviewStep1Action(
  reviewId: number,
  payload: ReviewStep1Request,
): Promise<ActionResult<ReviewStep1ResponseData>> {
  try {
    const data = await api.patch<ReviewStep1ResponseData, ReviewStep1Request>(
      `/reviews/${reviewId}/step1`,
      payload,
    );

    return { success: true, data };
  } catch (error) {
    console.error('리뷰 step1 저장 실패:', error);
    return { success: false, message: '1단계 저장에 실패했습니다.' };
  }
}

export async function patchReviewStep2SizeAction(
  reviewId: number,
  payload: ReviewStep2SizeRequest,
): Promise<ActionResult> {
  try {
    await api.patch<Record<string, never>, ReviewStep2SizeRequest>(
      `/reviews/${reviewId}/step2/size`,
      payload,
    );
    return { success: true };
  } catch (error) {
    console.error('리뷰 step2(사이즈) 저장 실패:', error);
    return { success: false, message: '2단계 사이즈 저장에 실패했습니다.' };
  }
}

export async function patchReviewStep2MaterialAction(
  reviewId: number,
  payload: ReviewStep2MaterialRequest,
): Promise<ActionResult> {
  try {
    await api.patch<Record<string, never>, ReviewStep2MaterialRequest>(
      `/reviews/${reviewId}/step2/material`,
      payload,
    );
    return { success: true };
  } catch (error) {
    console.error('리뷰 step2(소재) 저장 실패:', error);
    return { success: false, message: '2단계 소재 저장에 실패했습니다.' };
  }
}

export async function submitReviewAction(
  reviewId: number,
  payload: ReviewSubmitRequest,
): Promise<ActionResult> {
  try {
    await api.post<Record<string, never>, ReviewSubmitRequest>(
      `/reviews/${reviewId}/submit`,
      payload,
    );

    return { success: true };
  } catch (error) {
    console.error('리뷰 제출 실패:', error);
    return { success: false, message: '리뷰 제출에 실패했습니다.' };
  }
}

/** 리뷰 도움돼요 토글 */
export async function toggleReviewHelpfulAction(
  reviewId: number,
): Promise<ActionResult<ReviewHelpfulData>> {
  try {
    const data = await api.post<ReviewHelpfulData, Record<string, never>>(
      `/reviews/${reviewId}/helpful`,
      {},
    );
    return { success: true, data };
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      return { success: false, message: '리뷰를 찾을 수 없습니다.' };
    }
    rethrowNextError(error);
    console.error('리뷰 도움돼요 토글 실패:', { error, reviewId });
    return { success: false, message: '도움돼요 처리에 실패했습니다.' };
  }
}

/** 리뷰 상세 조회 */
export async function getReviewDetailAction(
  reviewId: number,
): Promise<ReviewDetail | null> {
  try {
    const detail = await api.get<ReviewDetail>(`/reviews/${reviewId}/details`);
    return detail;
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      console.warn('리뷰 상세 조회: 리뷰를 찾을 수 없습니다.', { reviewId });
      return null;
    }
    rethrowNextError(error);
    console.error('리뷰 상세 조회 실패:', error);
    throw new Error(
      error instanceof Error ? error.message : '리뷰 상세 조회에 실패했습니다.',
    );
  }
}

/** 상품별 리뷰 목록 조회 */
export async function getProductReviewsAction(
  productId: number,
  query: ProductReviewsQuery = {},
): Promise<PageResponse<ProductReviewListItem>> {
  const page = query.page ?? 0;
  const pageSize = query.pageSize ?? REVIEW_LIST_DEFAULT_PAGE_SIZE;
  const params: Record<
    string,
    string | number | boolean | string[] | undefined
  > = { ...query };
  params.page = page;
  params.pageSize = pageSize;
  params.sort = query.sort ?? 'BEST';

  try {
    return await api.get<PageResponse<ProductReviewListItem>>(
      `/products/${productId}/reviews`,
      {
        params,
      },
    );
  } catch (error) {
    rethrowNextError(error);
    console.error('상품 리뷰 목록 조회 실패:', { error, productId, params });
    return createEmptyReviewPage(page, pageSize);
  }
}

/** 리뷰 통계 요약 조회 */
export async function getProductReviewsSummaryAction(
  productId: number,
): Promise<ReviewStatsData> {
  try {
    return await api.get<ReviewStatsData>(
      `/products/${productId}/reviews/summary`,
    );
  } catch (error) {
    rethrowNextError(error);
    console.error('리뷰 통계 요약 조회 실패:', { error, productId });
    return createEmptyReviewSummary();
  }
}
