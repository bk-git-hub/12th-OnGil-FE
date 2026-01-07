'use server';

import webpush from 'web-push';

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY;

// VAPID 키가 모두 존재하면 web-push에 설정
if (PUBLIC_KEY && PRIVATE_KEY) {
  try {
    webpush.setVapidDetails('mailto:admin@ongil.com', PUBLIC_KEY, PRIVATE_KEY);
  } catch (e) {
    console.error(e);
  }
}

// 서버가 구독자 정보를 저장하는 테스트용 변수, 서버 재실행 시 초기화, 추후 구현시 백엔드 DB로 대체 필요
let lastSubscription: PushSubscription | null = null;

// 1. 구독 정보 저장 (구독 버튼 누르면 실행)
// 서버에 추가되는지.
export async function saveSubscription(sub: PushSubscription) {
  lastSubscription = sub;
  // console.log('서버: 최신 구독자가 등록되었습니다.');
  return { success: true };
}

// 2. 구독 정보 삭제 (취소 버튼 누르면 실행)
// 서버에서 삭제되는지.
export async function deleteSubscription() {
  lastSubscription = null;
  // console.log('서버: 구독자가 삭제되었습니다.');
  return { success: true };
}

// 3. 알림 발송
export async function sendPushNotification(message: string) {
  if (!lastSubscription) {
    return {
      success: false,
      error: '등록된 구독자가 없습니다. 먼저 [알림 받기]를 눌러주세요.',
    };
  }
  if (!PUBLIC_KEY || !PRIVATE_KEY) {
    return { success: false, error: 'VAPID 키 설정 오류' };
  }

  try {
    await webpush.sendNotification(
      lastSubscription as any,
      JSON.stringify({
        title: '온길 알림',
        body: message,
        url: '/',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png',
      }),
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: '발송 실패' };
  }
}
