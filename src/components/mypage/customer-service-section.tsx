import Link from 'next/link';
import { CircleHelp, Store, type LucideIcon } from 'lucide-react';
import { MessageSquare } from 'lucide-react';

const customerServiceItems = [
  {
    icon: CircleHelp,
    label: '자주 묻는\n질문',
    href: '/faq',
  },
  {
    icon: MessageSquare,
    label: '문의하기',
    href: '/inquiry',
  },
  {
    icon: Store,
    label: '입점 문의',
    href: '/vendor-inquiry',
  },
] satisfies Array<{ icon: LucideIcon; label: string; href: string }>;

export default function CustomerServiceSection() {
  return (
    <div className="border-t border-gray-200">
      <h2 className="border-y border-black px-7 py-8 text-3xl leading-normal font-semibold">
        고객센터
      </h2>
      <div className="mx-5 my-10 rounded-lg border border-black px-5 py-10">
        <div className="flex items-center justify-center gap-14">
          {customerServiceItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex max-w-20 flex-col items-center gap-2"
            >
              <div className="flex h-12 w-12 items-center justify-center">
                <item.icon
                  aria-hidden="true"
                  className="h-10 w-10 text-[#00363D]"
                  strokeWidth={2.3}
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
