import Link from 'next/link';

const menuItems = [
  {
    icon: 'icons/cart.svg',
    label: '장바구니',
    href: '/cart',
  },
  {
    icon: 'icons/order.svg',
    label: '주문내역',
    href: '/orders',
  },
  {
    icon: 'icons/review.svg',
    label: '리뷰 관리',
    href: '/reviews',
  },
  {
    icon: 'icons/inquiry.svg',
    label: '문의하기',
    href: '/inquiry',
  },
];

export default function QuickMenuSection() {
  return (
    <div className="mt-6 border-y border-black px-5 py-5">
      <div className="grid grid-cols-4 gap-4">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="flex flex-col items-center gap-2"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-lg">
              <img
                src={`/${item.icon}`}
                alt={item.label}
                className="h-full w-full"
              />
            </div>
            <span className="text-lg leading-normal font-normal">
              {item.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
