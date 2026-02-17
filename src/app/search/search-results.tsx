'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ProductList } from '@/components/product/product-list';
import { VoiceSearchResponse } from '@/types/domain/product';
import { useRecentSearches } from '@/components/search-bar/use-recent-searches';

interface SearchResultsProps {
  data: VoiceSearchResponse;
  query: string;
}

export function SearchResults({ data, query }: SearchResultsProps) {
  const { addSearch } = useRecentSearches();
  const [recommendedKeywords, setRecommendedKeywords] = useState<string[]>([]);

  // Save the extracted keyword to recent searches
  useEffect(() => {
    if (data.extractedKeyword) {
      addSearch(data.extractedKeyword);
    }
  }, [data.extractedKeyword, addSearch]);

  useEffect(() => {
    const hasSearchResult =
      data.searchResult.hasResult && data.searchResult.products.content.length > 0;

    if (hasSearchResult) {
      setRecommendedKeywords([]);
      return;
    }

    let isMounted = true;
    const fetchRecommendedKeywords = async () => {
      try {
        const response = await fetch('/api/search/recommend', {
          method: 'GET',
          cache: 'no-store',
        });

        if (!response.ok) {
          if (isMounted) {
            setRecommendedKeywords([]);
          }
          return;
        }

        const payload = (await response.json()) as string[] | { data?: string[] };
        const nextKeywords = Array.isArray(payload)
          ? payload
          : Array.isArray(payload.data)
            ? payload.data
            : [];

        if (isMounted) {
          setRecommendedKeywords(nextKeywords);
        }
      } catch {
        if (isMounted) {
          setRecommendedKeywords([]);
        }
      }
    };

    void fetchRecommendedKeywords();

    return () => {
      isMounted = false;
    };
  }, [data.searchResult.hasResult, data.searchResult.products.content.length]);

  const { extractedKeyword, searchResult } = data;
  const products = searchResult.products.content;
  const totalElements = searchResult.products.totalElements;
  const hasResult = searchResult.hasResult;
  const displayKeywords =
    recommendedKeywords.length > 0
      ? recommendedKeywords
      : Array.isArray(searchResult.alternatives)
        ? searchResult.alternatives
        : [];

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
        <div className="flex flex-col items-center px-4 py-12">
          <Image src="/icons/notfound.svg" alt="" width={119} height={119} />

          <div className="mt-8 text-center">
            <p className="text-[30px] leading-tight font-semibold text-black">
              검색 결과가 없습니다.
              <br />
              이런 검색어는 어때요?
            </p>
          </div>

          {displayKeywords.length > 0 && (
            <div className="mt-10 grid w-full max-w-[560px] grid-cols-2 gap-4">
              {displayKeywords.slice(0, 6).map((keyword, index) => (
                <Link
                  key={`${keyword}-${index}`}
                  href={`/search?q=${encodeURIComponent(keyword)}`}
                  className="rounded-full border border-[#8a8a8a] bg-white px-6 py-3 text-center text-xl font-medium text-black"
                >
                  {keyword}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
