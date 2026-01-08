'use client';

import { useState } from 'react';
import {
  saveSubscription,
  deleteSubscription,
  sendPushNotification,
} from '@/app/actions/push';

// VAPID 공개 키(Base64 문자열)를 브라우저 pushManager가 인식할 수 있는 Uint8Array 포맷으로 변환하는 함수.
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// 알림 구독 및 발송 테스트 컴포넌트
export default function NotificationManager() {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null,
  );
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // 구독하기 (버튼 누르면 실행)
  const handleSubscribe = async () => {
    const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
    if (!vapidKey) return alert('VAPID 키가 없습니다.');

    setLoading(true);
    try {
      if (!('serviceWorker' in navigator))
        return alert('서비스 워커를 지원하지 않습니다.');

      const reg = await navigator.serviceWorker.register('/sw.js');
      await navigator.serviceWorker.ready;

      // 1. 브라우저에 이미 구독된 정보가 있는지 확인
      let sub = await reg.pushManager.getSubscription();

      // 2. 없으면 새로 구독
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(vapidKey),
        });
      }

      // 3. 서버에 구독 정보 전송/갱신
      await saveSubscription(JSON.parse(JSON.stringify(sub)));

      // 4. 상태 업데이트 -> 이제 발송 패널이 보임
      setSubscription(sub);
      alert('서버 연결 성공! 알림을 보낼 준비가 되었습니다.');
    } catch (e) {
      console.error(e);
      alert('구독 실패 (오류 발생)');
    } finally {
      setLoading(false);
    }
  };

  // 발송하기
  const handleSend = async () => {
    if (!message) return alert('메시지를 입력해주세요.');

    setLoading(true);
    try {
      const res = await sendPushNotification(message);
      if (res.success) {
        alert('발송 성공!');
        setMessage('');
      } else {
        alert('발송 실패: ' + res.error);
      }
    } catch (e) {
      alert('오류 발생');
    } finally {
      setLoading(false);
    }
  };

  // 구독 취소 (서버+브라우저 모두 삭제)
  const handleUnsubscribe = async () => {
    if (!confirm('구독을 취소하시겠습니까?')) return;

    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) await sub.unsubscribe(); // 브라우저에서 삭제

      await deleteSubscription(); // 서버에서 삭제
      setSubscription(null); // 다시 구독 버튼 보이게 변경
      alert('구독이 취소되었습니다.');
    } catch (e) {
      alert('취소 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto my-8 w-full max-w-sm rounded-xl border border-gray-100 bg-white p-6 text-center shadow">
      <h3 className="mb-4 text-lg font-bold text-gray-800">🔔 알림 테스트</h3>

      {!subscription ? (
        <button
          onClick={handleSubscribe}
          disabled={loading}
          className="w-full rounded-lg bg-[#00363D] py-3 font-bold text-white shadow-md transition"
        >
          {loading ? '연결 중...' : '알림 구독 & 서버 연결'}
        </button>
      ) : (
        <div className="animate-in fade-in slide-in-from-bottom-2 space-y-4 duration-300">
          <div className="rounded bg-green-50 p-2 text-sm font-bold text-green-700">
            ✅ 연결됨
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm transition focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="보낼 메시지"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={loading}
              className="rounded-lg bg-gray-800 px-4 text-sm font-bold text-white transition hover:bg-black disabled:opacity-50"
            >
              발송
            </button>
          </div>

          <button
            onClick={handleUnsubscribe}
            disabled={loading}
            className="text-xs text-gray-400 underline transition hover:text-red-500"
          >
            연결 끊기 (구독 취소)
          </button>
        </div>
      )}
    </div>
  );
}
