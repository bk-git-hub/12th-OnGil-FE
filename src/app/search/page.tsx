import { Suspense } from 'react';
import MainHeader from '@/components/layout/main-header';
import MainNavBar from '@/components/layout/main-nav-bar';
import { SearchContent } from './search-content';
import { SearchLoading } from './search-loading';
import { SearchEmpty } from './search-empty';

// Force dynamic rendering - don't cache this page
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q;

  return (
    <div className="flex flex-col items-center">
      <MainHeader />
      <div className="mx-auto min-h-screen w-full max-w-7xl bg-white">
        {!query ? (
          <SearchEmpty />
        ) : (
          <Suspense fallback={<SearchLoading />}>
            <SearchContent query={query} />
          </Suspense>
        )}
      </div>
      <MainNavBar />
    </div>
  );
}
