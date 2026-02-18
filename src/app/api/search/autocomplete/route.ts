import { NextResponse } from 'next/server';

import { api } from '@/lib/api-client';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('query') ?? '').trim();

    if (!query) {
      return NextResponse.json([], { status: 200 });
    }

    const data = await api.get<string[]>('/search/autocomplete', {
      params: { query },
    });

    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: '검색어 자동완성 조회에 실패했습니다.' },
      { status: 500 },
    );
  }
}
