import Link from 'next/link';
import Image from 'next/image';

const customerServiceItems = [
  {
    icon: 'icons/many-questions.svg',
    label: '자주 묻는\n질문',
    href: '/faq',
  },
  {
    icon: 'icons/inquiry.svg',
    label: '문의하기',
    href: '/inquiry',
  },
  {
    icon: 'icons/shop.svg',
    label: '입점 문의',
    href: '/vendor-inquiry',
  },
];

export default function CustomerServiceSection() {
  return (
    <div className="border-t border-gray-200">
      <h2 className="px-5 py-4 text-lg font-bold">고객센터</h2>
      <div className="mx-5 rounded-lg border border-gray-200 px-5 py-5">
        <div className="flex justify-center gap-8">
          {customerServiceItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center">
                <Image
                  src={`/${item.icon}`}
                  alt={item.label}
                  width={48}
                  height={48}
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
