import Link from 'next/link';
import Image from 'next/image';

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
    label: '미션 후 적립금',
    href: '/me/mission-points',
  },
];

export default function PaymentSection() {
  return (
    <div>
      <h2 className="border-y border-black px-7 py-8 text-3xl leading-normal font-semibold">
        결제 및 할인
      </h2>
      <div className="mx-5 my-10 rounded-lg border border-black px-5 py-10">
        <div className="flex items-center justify-center gap-14">
          {paymentMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex max-w-20 flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center">
                <Image
                  src={`/${item.icon}`}
                  alt={item.label}
                  className="h-full w-full"
                  width={48}
                  height={48}
                />
              </div>
              <span className="text-center text-lg leading-normal font-normal text-balance whitespace-pre-wrap">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
