'use client';

import Link from 'next/link';
import { signOut } from 'next-auth/react';

const settingsItems = [
  {
    icon: 'icons/notification.svg',
    label: '알림 받기',
    href: '/me/notifications',
    type: 'link' as const,
  },
  {
    icon: 'icons/my-edit.svg',
    label: '내 정보 수정',
    href: '/me/edit',
    type: 'link' as const,
  },
  {
    icon: 'icons/logout.svg',
    label: '로그아웃',
    type: 'logout' as const,
  },
  {
    icon: 'icons/people-delete.svg',
    label: '회원 탈퇴',
    href: '/me/withdraw',
    type: 'link' as const,
  },
];

export default function SettingsSection() {
  const handleLogout = async () => {
    await signOut({ callbackUrl: '/' });
  };

  return (
    <div className="border-t border-gray-200">
      <h2 className="px-5 py-4 text-lg font-bold">설정</h2>
      <div className="mx-5 rounded-lg border border-gray-200 px-5 py-5">
        <div className="grid grid-cols-2 gap-6">
          {settingsItems.map((item) =>
            item.type === 'logout' ? (
              <button
                key={item.label}
                onClick={handleLogout}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex h-12 w-12 items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="h-full w-full"
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">
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
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="h-full w-full"
                  />
                </div>
                <span className="text-xs font-medium text-gray-700">
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
