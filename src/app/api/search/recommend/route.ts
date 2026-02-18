import { NextResponse } from 'next/server';

import { api } from '@/lib/api-client';

export async function GET() {
  try {
    const data = await api.get<string[]>('/search/recommend');
    return NextResponse.json(data, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: '추천 검색어 조회에 실패했습니다.' },
      { status: 500 },
    );
  }
}
