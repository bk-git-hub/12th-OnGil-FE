// 1. 서비스 워커 설치
self.addEventListener('install', (event) => {
  // console.log('Service Worker: Installed');
  event.waitUntil(self.skipWaiting());
});

// 2. 서비스 워커 활성화
self.addEventListener('activate', (event) => {
  // console.log('Service Worker: Activated');
  event.waitUntil(self.clients.claim());
});

// 3. 푸시 알림 수신 (서버에서 보낸 알림 받기)
self.addEventListener('push', function (event) {
  if (!event.data) return;

  const data = event.data.json();

  // 앱을 켜놓은 상태라도 시스템 알림을 띄움.
  const options = {
    body: data.body,
    icon: '/icons/icon-192.png', // 알림 아이콘
    badge: '/icons/icon-192.png', // 안드로이드 상단바 아이콘
    vibrate: [100, 50, 100], // 진동 패턴
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '2',
      url: data.url || '/', // 클릭 시 이동할 주소
    },
  };

  event.waitUntil(
    self.registration.showNotification(data.title || '온길 알림', options),
  );
});

self.addEventListener('notificationclick', function (event) {
  // console.log('Notification click received.');

  event.notification.close();

  // 알림 데이터에 있는 URL 가져오기
  const urlToOpen = event.notification.data.url || '/';

  event.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(function (clientList) {
        // 1. 이미 열려있는 탭이 있다면 거기로 이동
        for (const client of clientList) {
          if (client.url === urlToOpen && 'focus' in client) {
            return client.focus();
          }
        }
        // 2. 없다면 새 창 열기
        if (clients.openWindow) {
          return clients.openWindow(urlToOpen);
        }
      }),
  );
});

// 4. 알림 클릭 시 동작
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  // 알림 클릭 시 해당 URL로 이동
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
