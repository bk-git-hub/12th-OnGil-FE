'use server';

import { redirect } from 'next/navigation';
import { auth } from '/auth';

import { ApiError, api } from '@/lib/api-client';
import { rethrowNextError } from '@/lib/server-action-utils';
import type { ApiResponse } from '@/types/common';
import type {
  PageResponse,
  ProductReviewListItem,
  ReviewDetail,
  ReviewHelpfulData,
  ReviewStatsData,
} from '@/types/domain/review';

const BASE_URL = process.env.BACKEND_API_URL;

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
  sizeSecondaryType?: 'POSITIVE' | 'NEGATIVE' | 'NORMAL';
  needsMaterialSecondaryQuestion: boolean;
  materialSecondaryType?: 'POSITIVE' | 'NEGATIVE' | 'NORMAL';
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

interface AiGeneratedReviewsData {
  reviewId: number;
  aiGeneratedReviews: string[];
}

interface ActionResult<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}

interface ErrorResponse {
  message?: string;
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
  pageSize = REVIEW_LIST_DEFAULT_PAGE_SIZE,
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
  const orderItemId =
    typeof rawOrderItemId === 'string' ? Number(rawOrderItemId) : NaN;

  if (!Number.isFinite(orderItemId)) {
    return;
  }

  const data = await api.post<InitReviewResponseData, Record<string, never>>(
    '/reviews/init',
    {},
    { params: { orderItemId } },
  );
  redirect(`/review/write/${data.reviewId}`);
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

export async function generateSizeAiReviewAction(
  reviewId: number,
): Promise<ActionResult<AiGeneratedReviewsData>> {
  try {
    const data = await api.get<AiGeneratedReviewsData>(`/reviews/${reviewId}/ai/size`);
    return { success: true, data };
  } catch (error) {
    console.error('리뷰 사이즈 AI 생성 실패:', error);
    return { success: false, message: '사이즈 AI 생성에 실패했습니다.' };
  }
}

export async function generateMaterialAiReviewAction(
  reviewId: number,
): Promise<ActionResult<AiGeneratedReviewsData>> {
  try {
    const data = await api.get<AiGeneratedReviewsData>(
      `/reviews/${reviewId}/ai/material`,
    );
    return { success: true, data };
  } catch (error) {
    console.error('리뷰 소재 AI 생성 실패:', error);
    return { success: false, message: '소재 AI 생성에 실패했습니다.' };
  }
}

export async function uploadReviewImagesAction(
  formData: FormData,
): Promise<ActionResult<string[]>> {
  try {
    if (!BASE_URL) {
      return { success: false, message: 'BACKEND_API_URL이 설정되지 않았습니다.' };
    }

    const images = formData
      .getAll('images')
      .filter((item): item is File => item instanceof File && item.size > 0);

    if (images.length === 0) {
      return { success: false, message: '업로드할 이미지가 없습니다.' };
    }
    if (images.length > 5) {
      return { success: false, message: '이미지는 최대 5장까지 업로드할 수 있습니다.' };
    }

    const session = await auth();
    const accessToken = session?.accessToken as string | undefined;

    const payload = new FormData();
    images.forEach((file) => payload.append('images', file));

    const response = await fetch(`${BASE_URL}/reviews/images`, {
      method: 'POST',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: payload,
      cache: 'no-store',
    });

    let responseData: unknown = null;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      responseData = await response.json();
    } else {
      responseData = await response.text();
    }

    if (!response.ok) {
      const errorData =
        typeof responseData === 'object' && responseData !== null
          ? (responseData as ErrorResponse)
          : { message: String(responseData) };
      return {
        success: false,
        message: errorData.message || '리뷰 이미지 업로드에 실패했습니다.',
      };
    }

    const uploadedUrls = (responseData as ApiResponse<string[]>).data ?? [];
    return { success: true, data: uploadedUrls };
  } catch (error) {
    console.error('리뷰 이미지 업로드 실패:', error);
    return { success: false, message: '리뷰 이미지 업로드에 실패했습니다.' };
  }
}

export async function submitReviewAction(
  reviewId: number,
  payload: ReviewSubmitRequest,
): Promise<ActionResult> {
  try {
    console.log('[review-submit] request', {
      endpoint: `/reviews/${reviewId}/submit`,
      reviewId,
      payload,
    });

    await api.post<Record<string, never>, ReviewSubmitRequest>(
      `/reviews/${reviewId}/submit`,
      payload,
    );

    console.log('[review-submit] success', { reviewId });
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
