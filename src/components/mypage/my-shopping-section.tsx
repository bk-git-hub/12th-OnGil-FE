import Link from 'next/link';
import { History, PackageX, type LucideIcon } from 'lucide-react';

const shoppingMenuItems = [
  {
    icon: PackageX,
    label: '반품 내역',
    href: '/me/returns',
  },
  {
    icon: History,
    label: '최근 본 상품',
    href: '/me/recent',
  },
] satisfies Array<{ icon: LucideIcon; label: string; href: string }>;

export default function MyShoppingSection() {
  return (
    <div className="flex flex-col gap-10">
      <h2 className="border-b border-black px-7 py-8 text-3xl leading-normal font-semibold">
        내 쇼핑
      </h2>
      <div className="mx-5 mb-10 rounded-lg border border-black px-10 py-14">
        <div className="flex items-center justify-center gap-[122px]">
          {shoppingMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center">
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
    </div>
  );
}
