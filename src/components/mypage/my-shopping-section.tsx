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
                <Image
                  src={`/${item.icon}`}
                  alt={item.label}
                  className="h-full w-full"
                  width={48}
                  height={48}
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
