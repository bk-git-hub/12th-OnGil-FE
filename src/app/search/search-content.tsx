import { api } from '@/lib/api-client';
import { VoiceSearchResponse } from '@/types/domain/product';
import { SearchResults } from './search-results';
import { SearchError } from './search-error';

async function fetchSearchResults(query: string): Promise<VoiceSearchResponse> {
  return await api.post<VoiceSearchResponse>(
    '/search/voice',
    {}, // Empty body - params are in query string
    {
      params: {
        speechText: query,
        page: '0',
        size: '20',
        sort: JSON.stringify(['string']),
      },
      cache: 'no-store',
    },
  );
}

interface SearchContentProps {
  query: string;
}

export async function SearchContent({ query }: SearchContentProps) {
  let data: VoiceSearchResponse | null = null;
  let error: Error | null = null;

  try {
    data = await fetchSearchResults(query);
  } catch (err) {
    error = err as Error;
  }

  if (error) {
    return <SearchError error={error} />;
  }

  if (!data) {
    return <SearchError error={new Error('검색 결과를 불러올 수 없습니다')} />;
  }

  return <SearchResults data={data} query={query} />;
}
