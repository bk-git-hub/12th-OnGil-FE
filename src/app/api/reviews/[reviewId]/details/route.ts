import { NextResponse } from 'next/server';

import { api } from '@/lib/api-client';
import { ReviewDetail } from '@/types/domain/review';

interface RouteContext {
  params: Promise<{ reviewId: string }>;
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const { reviewId } = await context.params;
    const numericReviewId = Number(reviewId);

    if (!Number.isFinite(numericReviewId)) {
      return NextResponse.json({ message: '유효하지 않은 리뷰 ID입니다.' }, { status: 400 });
    }

    const data = await api.get<ReviewDetail>(`/reviews/${numericReviewId}/details`);
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json({ message: '리뷰 상세 조회에 실패했습니다.' }, { status: 500 });
  }
}
