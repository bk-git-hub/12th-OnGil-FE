import { NextResponse } from 'next/server';

import { auth } from '/auth';

const BASE_URL = process.env.BACKEND_API_URL;

interface ErrorResponse {
  message?: string;
}

export async function POST(request: Request) {
  try {
    if (!BASE_URL) {
      return NextResponse.json(
        { message: 'BACKEND_API_URL이 설정되지 않았습니다.' },
        { status: 500 },
      );
    }

    const incomingFormData = await request.formData();
    const images = incomingFormData
      .getAll('images')
      .filter((item): item is File => item instanceof File && item.size > 0);

    if (images.length === 0) {
      return NextResponse.json(
        { message: '업로드할 이미지가 없습니다.' },
        { status: 400 },
      );
    }

    const payload = new FormData();
    images.forEach((file) => payload.append('images', file));

    const session = await auth();
    const accessToken = session?.accessToken as string | undefined;

    const response = await fetch(`${BASE_URL}/reviews/images`, {
      method: 'POST',
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      body: payload,
      cache: 'no-store',
    });

    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      const json = await response.json();
      return NextResponse.json(json, { status: response.status });
    }

    const text = await response.text();
    if (!response.ok) {
      return NextResponse.json(
        { message: text || '리뷰 이미지 업로드에 실패했습니다.' },
        { status: response.status },
      );
    }

    return new NextResponse(text, { status: response.status });
  } catch (error) {
    const message =
      error && typeof error === 'object' && 'message' in error
        ? String((error as ErrorResponse).message)
        : '리뷰 이미지 업로드에 실패했습니다.';
    return NextResponse.json({ message }, { status: 500 });
  }
}
