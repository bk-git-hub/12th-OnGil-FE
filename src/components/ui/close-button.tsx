'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface CloseButtonProps {
  href?: string;
  replace?: boolean;
  fallbackHref?: string;
}

function navigateByMode(
  router: ReturnType<typeof useRouter>,
  href?: string,
  replace?: boolean,
  fallbackHref?: string,
) {
  if (href) {
    if (replace) {
      router.replace(href);
      return;
    }

    router.push(href);
    return;
  }

  if (typeof window !== 'undefined' && window.history.length > 1) {
    router.back();
    return;
  }

  if (fallbackHref) {
    router.replace(fallbackHref);
    return;
  }

  router.back();
}

export function CloseButton({
  href,
  replace = false,
  fallbackHref,
}: CloseButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => navigateByMode(router, href, replace, fallbackHref)}
      className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
    >
      <Image src="/icons/arrow.svg" width={37} height={37} alt="뒤로가기" />
    </button>
  );
}

export function CloseXButton({
  href,
  replace = false,
  fallbackHref,
}: CloseButtonProps) {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => navigateByMode(router, href, replace, fallbackHref)}
      className="-ml-2 flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-100"
    >
      <Image src="/icons/X.svg" width={23} height={23} alt="닫기" />
    </button>
  );
}
