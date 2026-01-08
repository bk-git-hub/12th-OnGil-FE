'use client';

import { useState, useEffect } from 'react';

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // 1. 이미 PWA 모드로 실행 중인지 확인, PWA 추가 했을 시 안내창 안 띄움.
    const isStandaloneMode = window.matchMedia(
      '(display-mode: standalone)',
    ).matches;
    setIsStandalone(isStandaloneMode);
    if (isStandaloneMode) return;

    // 2. 기기 확인 (iOS vs 그 외)
    // ios는 beforeinstallprompt 이벤트를 지원하지 않음.
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    if (isIosDevice) {
      // iOS: 브라우저가 설치 이벤트를 지원 안 함
      setIsVisible(true);
    } else {
      // 안드로이드/PC: 브라우저가 "설치 가능 신호"를 줄 때까지 대기
      const handleBeforeInstallPrompt = (e: any) => {
        e.preventDefault(); // 브라우저 기본 하단바 숨기기
        setDeferredPrompt(e); // 이벤트 저장
        setIsVisible(true); // 이제 버튼을 보여줌
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

      return () => {
        window.removeEventListener(
          'beforeinstallprompt',
          handleBeforeInstallPrompt,
        );
      };
    }
  }, []);

  const handleInstallClick = async () => {
    // 저장된 이벤트가 없으면 무시.
    if (!deferredPrompt) return;

    // 브라우저 설치 팝업 실행
    deferredPrompt.prompt();

    // 사용자의 설치 승인/거절 여부 확인
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`사용자 설치 응답: ${outcome}`);

    // 설치 후 초기화 (팝업 닫기)
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  // 앱 모드이거나, 보여줄 상황이 아니면 렌더링 안 함
  if (isStandalone || !isVisible) {
    return null;
  }

  return (
    <div className="animate-in slide-in-from-bottom fixed bottom-0 left-0 z-50 w-full px-4 pb-6 duration-500">
      <div className="relative mx-auto max-w-md rounded-2xl border border-gray-100 bg-white p-5 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex items-start gap-4">
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl bg-gray-100">
            <img
              src="/icons/icon-192.png"
              alt="앱 아이콘"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <h3 className="mb-1 text-lg font-bold text-gray-900">
              앱으로 더 편하게 쇼핑하세요!
            </h3>
            <p className="mb-3 text-sm leading-snug text-gray-500">
              설치하시면 별도의 로그인 없이
              <br />더 빠르고 쾌적하게 이용할 수 있어요.
            </p>

            {isIOS ? (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-600">
                <p className="mb-1 flex items-center gap-1">
                  1. 브라우저 하단{' '}
                  <span className="text-lg text-blue-500">share</span> (공유)
                  버튼 클릭
                </p>
                <p className="flex items-center gap-1">
                  2.{' '}
                  <span className="rounded bg-gray-200 px-1 font-bold">
                    홈 화면에 추가
                  </span>{' '}
                  선택
                </p>
              </div>
            ) : (
              <button
                onClick={handleInstallClick}
                className="w-full rounded-lg bg-[#00363D] py-2.5 text-sm font-bold text-white shadow-sm transition active:scale-95"
              >
                지금 간편하게 설치하기
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
