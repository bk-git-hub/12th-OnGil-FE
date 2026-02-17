'use client';

import { useEffect } from 'react';
import ProductList from '@/components/product/product-list';
import { VoiceSearchResponse } from '@/types/domain/product';
import { useRecentSearches } from '@/components/search-bar/use-recent-searches';

interface SearchResultsProps {
  data: VoiceSearchResponse;
  query: string;
}

export function SearchResults({ data, query }: SearchResultsProps) {
  const { addSearch } = useRecentSearches();

  // Save the extracted keyword to recent searches
  useEffect(() => {
    if (data.extractedKeyword) {
      addSearch(data.extractedKeyword);
    }
  }, [data.extractedKeyword, addSearch]);

  const { extractedKeyword, searchResult } = data;
  const products = searchResult.products.content;
  const totalElements = searchResult.products.totalElements;
  const hasResult = searchResult.hasResult;

  return (
    <div className="p-4">
      {/* Search header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          &apos;{extractedKeyword}&apos; 검색 결과
        </h1>
        {query !== extractedKeyword && (
          <p className="mt-2 text-sm text-gray-500">원래 검색어: {query}</p>
        )}
      </div>

      {/* Search results */}
      {hasResult && products.length > 0 ? (
        <ProductList products={products} totalElements={totalElements} />
      ) : (
        <div className="flex flex-col items-center gap-6 py-12">
          <div className="text-center">
            <p className="text-lg font-medium text-gray-700">
              검색 결과가 없습니다
            </p>
            <p className="mt-2 text-sm text-gray-500">
              다른 검색어로 시도해보세요
            </p>
          </div>

          {/* Alternative suggestions */}
          {searchResult.alternatives &&
            searchResult.alternatives.length > 0 && (
              <div className="w-full max-w-md">
                <h2 className="mb-3 text-sm font-semibold text-gray-700">
                  추천 검색어
                </h2>
                <div className="flex flex-wrap gap-2">
                  {searchResult.alternatives.map((keyword, index) => (
                    <a
                      key={index}
                      href={`/search?q=${encodeURIComponent(keyword)}`}
                      className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm hover:bg-gray-50"
                    >
                      {keyword}
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}
    </div>
  );
}
