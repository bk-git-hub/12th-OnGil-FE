import { Suspense } from 'react';
import MainHeader from '@/components/layout/main-header';
import { SearchResults } from './search-results';
import { SearchError } from './search-error';
import { VoiceSearchResponse } from '@/types/domain/product';
import { ApiResponse } from '@/types/common';

// Force dynamic rendering - don't cache this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

async function fetchSearchResults(query: string): Promise<VoiceSearchResponse> {
  const params = new URLSearchParams({
    speechText: query,
    page: '0',
    size: '20',
    sort: JSON.stringify(['string']),
  });

  const response = await fetch(
    `https://ongil.shop/api/search/voice?${params.toString()}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    throw new Error(`검색 요청에 실패했습니다: ${response.status}`);
  }

  const result: ApiResponse<VoiceSearchResponse> = await response.json();
  return result.data;
}

function SearchLoading() {
  return (
    <div className="flex h-60 items-center justify-center">
      <div className="text-gray-500">검색 중...</div>
    </div>
  );
}

function EmptyQuery() {
  return (
    <div className="flex h-60 items-center justify-center text-gray-500">
      검색어를 입력해주세요
    </div>
  );
}

async function SearchContent({ query }: { query: string }) {
  try {
    const data = await fetchSearchResults(query);
    return <SearchResults data={data} query={query} />;
  } catch (error) {
    return <SearchError error={error as Error} />;
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q;

  return (
    <div className="flex flex-col items-center">
      <MainHeader />
      <div className="mx-auto min-h-screen w-full max-w-7xl bg-white">
        {!query ? (
          <EmptyQuery />
        ) : (
          <Suspense fallback={<SearchLoading />}>
            <SearchContent query={query} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
