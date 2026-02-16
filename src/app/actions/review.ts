'use server';

import { redirect } from 'next/navigation';
import { auth } from '/auth';

import { api } from '@/lib/api-client';
import type { ApiResponse } from '@/types/common';

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
