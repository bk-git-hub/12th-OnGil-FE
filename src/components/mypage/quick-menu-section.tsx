import Link from 'next/link';
import {
  MessageSquare,
  ReceiptText,
  ShoppingCart,
  Star,
  type LucideIcon,
} from 'lucide-react';

const menuItems = [
  {
    icon: ShoppingCart,
    label: '장바구니',
    href: '/cart',
  },
  {
    icon: ReceiptText,
    label: '주문내역',
    href: '/orders',
  },
  {
    icon: Star,
    label: '리뷰관리',
    href: '/reviews',
  },
  {
    icon: MessageSquare,
    label: '문의하기',
    href: '/inquiry',
  },
] satisfies Array<{ icon: LucideIcon; label: string; href: string }>;

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
              <item.icon
                aria-hidden="true"
                className="h-10 w-10 text-[#00363D]"
                strokeWidth={2.3}
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
