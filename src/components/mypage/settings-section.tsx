'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { Bell, LogOut, UserPen, UserX, type LucideIcon } from 'lucide-react';

const settingsItems = [
  {
    icon: Bell,
    label: '알림 받기',
    href: '/me/notifications',
    type: 'link' as const,
  },
  {
    icon: UserPen,
    label: '내 정보 수정',
    href: '/me/edit',
    type: 'link' as const,
  },
  {
    icon: LogOut,
    label: '로그아웃',
    type: 'logout' as const,
  },
  {
    icon: UserX,
    label: '회원 탈퇴',
    href: '/me/withdraw',
    type: 'link' as const,
  },
] satisfies Array<{
  icon: LucideIcon;
  label: string;
  href?: string;
  type: 'link' | 'logout';
}>;

export default function SettingsSection() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="border-t border-gray-200">
      <h2 className="border-y border-black px-7 py-8 text-3xl leading-normal font-semibold">
        설정
      </h2>
      <div className="mx-5 my-10 rounded-lg border border-black px-5 py-4">
        <div className="grid grid-flow-col grid-rows-2 items-center justify-between gap-10">
          {settingsItems.map((item) =>
            item.type === 'logout' ? (
              <button
                key={item.label}
                onClick={handleLogout}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex h-12 w-12 items-center justify-center">
                  <item.icon
                    aria-hidden="true"
                    className="h-10 w-10 text-[#00363D]"
                    strokeWidth={2.3}
                  />
                </div>
                <span className="text-center text-lg leading-normal font-normal">
                  {item.label}
                </span>
              </button>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex h-12 w-12 items-center justify-center">
                  <item.icon
                    aria-hidden="true"
                    className="h-10 w-10 text-[#00363D]"
                    strokeWidth={2.3}
                  />
                </div>
                <span className="text-center text-lg leading-normal font-normal">
                  {item.label}
                </span>
              </Link>
            ),
          )}
        </div>
      </div>
    </div>
  );
}
