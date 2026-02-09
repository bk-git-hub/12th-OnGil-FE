import Link from 'next/link';
import Image from 'next/image';

const shoppingMenuItems = [
  {
    icon: 'icons/delivery-return.svg',
    label: '반품 내역',
    href: '/me/returns',
  },
  {
    icon: 'icons/current-view.svg',
    label: '최근 본 상품',
    href: '/me/recent',
  },
];

export default function MyShoppingSection() {
  return (
    <div className="border-t border-gray-200">
      <h2 className="px-5 py-4 text-lg font-bold">내 쇼핑</h2>
      <div className="mx-5 rounded-lg border border-gray-200 px-5 py-5">
        <div className="flex justify-center gap-12">
          {shoppingMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2"
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
              <span className="text-xs font-medium text-gray-700">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
