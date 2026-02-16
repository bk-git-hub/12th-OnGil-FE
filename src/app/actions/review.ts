'use server';

import { redirect } from 'next/navigation';

import { api } from '@/lib/api-client';

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

interface ActionResult<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
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
