import Link from 'next/link';
import { CreditCard, Ticket, PiggyBank } from 'lucide-react';

const paymentMenuItems = [
  {
    icon: 'icons/payment.svg',
    label: '결제 수단',
    href: '/me/payment-methods',
  },
  {
    icon: 'icons/coupon.svg',
    label: '할인 쿠폰',
    href: '/me/coupons',
  },
  {
    icon: 'icons/mission.svg',
    label: '미션 후\n적립금',
    href: '/me/mission-points',
  },
];

export default function PaymentSection() {
  return (
    <div className="border-t border-gray-200">
      <h2 className="px-5 py-4 text-lg font-bold">결제 및 할인</h2>
      <div className="mx-5 rounded-lg border border-gray-200 px-5 py-5">
        <div className="flex justify-center gap-8">
          {paymentMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center">
                <img
                  src={`/${item.icon}`}
                  alt={item.label}
                  className="h-full w-full"
                />
              </div>
              <span className="text-center text-xs font-medium whitespace-pre-wrap text-gray-700">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
