import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { getOrders } from '@/app/actions/order';
import { getDefaultDateRange } from '@/lib/date-utils';
import { OrderList } from '@/components/orders/order-list';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: '주문 내역 | OnGil',
  description: '주문 내역을 확인합니다.',
};

export default async function OrderListPage() {
  const defaults = getDefaultDateRange('1m');
  const response = await getOrders({
    startDate: defaults.startDate,
    endDate: defaults.endDate,
    page: 0,
    size: 10,
  });

  const initialOrders = response.content.filter(
    (order) => !String(order.orderStatus).includes('CANCEL'),
  );

  return (
    <div className="bg-background relative min-h-screen">
      {/* 헤더 */}
      <header className="bg-background sticky top-0 z-10 flex h-24 items-center justify-between border-b border-gray-500 px-6">
        <Link
          href="/me"
          className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
        >
          <Image src="/icons/arrow.svg" width={37} height={37} alt="뒤로가기" />
        </Link>
        <h1 className="text-center text-3xl leading-normal font-semibold">
          주문 내역
        </h1>
        <div className="w-8" />
      </header>

      {/* 검색 + 리스트 */}
      <OrderList
        initialOrders={initialOrders}
        initialTotalPages={response.totalPages}
        initialCurrentPage={response.currentPage}
        defaultStartDate={defaults.startDate}
        defaultEndDate={defaults.endDate}
      />
    </div>
  );
}
