'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OrderListCard } from '@/components/orders/order-list-card';
import {
  OrderSearchModal,
  type OrderSearchParams,
} from '@/components/orders/order-search-modal';
import { OrderSummary } from '@/types/domain/order';
import Image from 'next/image';
import { getOrders } from '@/app/actions/order';

interface OrderListProps {
  initialOrders: OrderSummary[];
  initialTotalPages: number;
  initialCurrentPage: number;
  defaultStartDate: string;
  defaultEndDate: string;
}

export function OrderList({
  initialOrders,
  initialTotalPages,
  initialCurrentPage,
  defaultStartDate,
  defaultEndDate,
}: OrderListProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [orders, setOrders] = useState<OrderSummary[]>(initialOrders);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [currentPage, setCurrentPage] = useState(initialCurrentPage);

  const [keyword, setKeyword] = useState('');
  const [startDate, setStartDate] = useState(defaultStartDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [hasSearched, setHasSearched] = useState(false);

  const fetchOrders = async (params: {
    keyword?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    append?: boolean;
  }) => {
    setLoading(true);
    try {
      const response = await getOrders({
        keyword: params.keyword || undefined,
        startDate: params.startDate || undefined,
        endDate: params.endDate || undefined,
        page: params.page,
        size: 10,
      });
      const filtered = response.content.filter(
        (order) => !String(order.orderStatus).includes('CANCEL'),
      );
      if (params.append) {
        setOrders((prev) => [...prev, ...filtered]);
      } else {
        setOrders(filtered);
      }
      setTotalPages(response.totalPages);
      setCurrentPage(response.currentPage);
    } catch (error) {
      console.error('주문 내역 조회 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (params: OrderSearchParams) => {
    setKeyword(params.keyword);
    setStartDate(params.startDate);
    setEndDate(params.endDate);
    setHasSearched(true);
    setIsSearchOpen(false);
    fetchOrders({ ...params, page: 0 });
  };

  const handleLoadMore = () => {
    if (currentPage + 1 < totalPages) {
      fetchOrders({
        keyword,
        startDate,
        endDate,
        page: currentPage + 1,
        append: true,
      });
    }
  };

  return (
    <>
      <main className="space-y-4 px-5 py-6">
        <div
          onClick={() => setIsSearchOpen(true)}
          className="bg-secondary-gray text-muted-foreground mb-12 flex h-12 w-full cursor-pointer items-center justify-between rounded-md border border-[#5E5D5D] px-5 py-2"
        >
          <span className="text-xl leading-normal font-normal">
            {keyword || '검색어를 입력하세요'}
          </span>
          <Image
            src="icons/search.svg"
            alt="검색 아이콘"
            width={26}
            height={26}
          />
        </div>

        {hasSearched && (
          <p className="mb-8 text-lg text-gray-500">
            조회기간: {startDate} ~ {endDate}
          </p>
        )}

        {/* 주문 리스트 */}
        <div className="space-y-4 pb-20">
          {orders.length === 0 ? (
            <div className="flex justify-center py-20">
              <span className="text-muted-foreground text-lg">
                주문 내역이 없습니다.
              </span>
            </div>
          ) : (
            <>
              {orders.map((order) => (
                <OrderListCard key={order.orderId} order={order} />
              ))}
              {currentPage + 1 < totalPages && (
                <div className="mt-4 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? '불러오는 중...' : '더보기'}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {isSearchOpen && (
        <OrderSearchModal
          defaultValues={{ keyword, startDate, endDate }}
          onSearch={handleSearch}
          onClose={() => setIsSearchOpen(false)}
        />
      )}
    </>
  );
}
