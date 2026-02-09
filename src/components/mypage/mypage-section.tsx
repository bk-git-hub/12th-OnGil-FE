import Link from 'next/link';
import Image from 'next/image';
import { signOut } from 'next-auth/react';

interface MypageItem {
  icon: string;
  label: string;
  href?: string;
  onClick?: () => void;
  type?: 'link' | 'button';
}

interface MypageSectionProps {
  title?: string;
  items: MypageItem[];
  outerDivClassName?: string;
  innerDivClassName?: string;
  gridClassName?: string;
  itemClassName?: string;
  iconContainerClassName?: string;
  labelClassName?: string;
}

export default function MypageSection({
  title,
  items,
  outerDivClassName = 'border-t border-gray-200',
  innerDivClassName = 'mx-5 rounded-lg border border-gray-200 px-5 py-5',
  gridClassName = 'flex justify-center gap-8',
  itemClassName = 'flex flex-col items-center gap-2',
  iconContainerClassName = 'flex h-12 w-12 items-center justify-center',
  labelClassName = 'text-center text-xs font-medium whitespace-pre-wrap text-gray-700',
}: MypageSectionProps) {
  const handleItemClick = async (item: MypageItem) => {
    if (item.type === 'button' && item.onClick) {
      item.onClick();
    } else if (item.type === 'button' && item.label === '로그아웃') {
      await signOut({ callbackUrl: '/' });
    }
  };

  return (
    <div className={outerDivClassName}>
      {title && <h2 className="px-5 py-4 text-lg font-bold">{title}</h2>}
      <div className={innerDivClassName}>
        <div className={gridClassName}>
          {items.map((item) => {
            const content = (
              <>
                <div className={iconContainerClassName}>
                  <Image
                    src={item.icon}
                    alt={item.label}
                    className="h-full w-full"
                    width={48}
                    height={48}
                  />
                </div>
                <span className={labelClassName}>{item.label}</span>
              </>
            );

            if (item.type === 'button') {
              return (
                <button
                  key={item.label}
                  onClick={() => handleItemClick(item)}
                  className={itemClassName}
                >
                  {content}
                </button>
              );
            }
            return (
              <Link
                key={item.label}
                href={item.href || '#'}
                className={itemClassName}
              >
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
