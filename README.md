# 온길 FE (12th-OnGil-FE)

<p align="left">
  <a href="https://nextjs.org/">
    <img src="https://img.shields.io/badge/Next.js-16.1.1-000000?logo=nextdotjs&logoColor=white" alt="Next.js 16" />
  </a>
  <a href="https://react.dev/">
    <img src="https://img.shields.io/badge/React-19.2.3-61DAFB?logo=react&logoColor=000" alt="React 19" />
  </a>
  <a href="https://www.typescriptlang.org/">
    <img src="https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
  </a>
  <a href="https://tailwindcss.com/">
    <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS v4" />
  </a>
  <a href="https://pnpm.io/">
    <img src="https://img.shields.io/badge/pnpm-workspace-F69220?logo=pnpm&logoColor=white" alt="pnpm" />
  </a>
</p>

<p align="left">
  <a href="https://github.com/Seoje1405/12th-OnGil-FE/actions/workflows/ai-fix.yml">
    <img src="https://github.com/Seoje1405/12th-OnGil-FE/actions/workflows/ai-fix.yml/badge.svg" alt="AI Auto Fixer" />
  </a>
  <a href="https://github.com/Seoje1405/12th-OnGil-FE/actions/workflows/ai-targeted-fix.yml">
    <img src="https://github.com/Seoje1405/12th-OnGil-FE/actions/workflows/ai-targeted-fix.yml/badge.svg" alt="AI Targeted Fixer" />
  </a>
</p>

시니어 사용성을 우선한 쇼핑 경험을 목표로, 상품 탐색부터 주문/리뷰/마이페이지까지 하나의 흐름으로 제공하는 Next.js 프론트엔드 프로젝트입니다.

## Table of Contents

- [프로젝트 소개](#project-overview)
- [주요 기능](#key-features)
- [기술 스택](#tech-stack)
- [빠른 시작](#quick-start)
- [환경 변수](#environment-variables)
- [프로젝트 구조](#project-structure)
- [라우트 맵 (요약)](#route-map)
- [데이터 흐름/아키텍처 개요](#architecture)
- [협업 가이드](#collaboration-guide)
- [문제 해결 (Troubleshooting)](#troubleshooting)
- [라이선스/비고](#license)

<a id="project-overview"></a>
## 프로젝트 소개

온길 FE는 시니어 친화 UI/UX를 중심으로 구성된 커머스 프론트엔드입니다.

- 앱 목적: 접근성 높은 쇼핑 플로우 제공
- 핵심 도메인: 상품 탐색, 장바구니, 주문/결제, 리뷰, 마이페이지
- 기본 사용자 흐름:

```text
탐색/검색 -> 장바구니 -> 주문/결제 -> 리뷰/마이페이지
```

<a id="key-features"></a>
## 주요 기능

1. 인증
- NextAuth v5 기반 인증 구성
- 이메일/비밀번호 로그인
- 카카오/구글 OAuth 로그인

2. 상품 탐색/검색
- 카테고리/상품 상세 탐색
- 검색 자동완성, 최근 검색어
- Web Speech API 기반 음성 검색

3. 커머스
- 장바구니 담기/수정/삭제/개수 동기화
- 주문 생성(장바구니 주문, 바로 구매)
- 주문 목록/상세/취소/삭제

4. 리뷰
- 단계형 리뷰 작성 플로우
- 리뷰 목록/상세/요약 통계
- "도움돼요" 토글

5. 사용자 영역
- 배송지 관리
- 찜(위시리스트)
- 프로필 이미지 관리
- 체형 정보 입력/수정

6. PWA/알림
- 서비스 워커 등록(`public/sw.js`)
- 웹 푸시 구독/해지/발송 테스트 액션

<a id="tech-stack"></a>
## 기술 스택

| 구분 | 사용 기술 | 비고 |
| --- | --- | --- |
| Framework | Next.js 16 (App Router) | 서버 컴포넌트/라우팅 |
| Runtime | React 19, Node.js 20+ 권장 | 동시성/최신 API 기준 |
| Language | TypeScript 5 | `strict` 모드 사용 |
| Styling | Tailwind CSS v4, tw-animate-css | 유틸리티 기반 스타일링 |
| State | Zustand | 장바구니 카운트 등 클라이언트 상태 |
| Validation | Zod, React Hook Form | 입력 검증 및 폼 처리 |
| Auth | NextAuth v5 (beta) | JWT 세션 + 토큰 갱신 |
| UI/Utilities | Radix UI, date-fns, clsx, cva | 공용 UI/유틸 구성 |
| Push | web-push, Service Worker | PWA 알림 테스트 |

<a id="quick-start"></a>
## 빠른 시작

### 1) 사전 요구사항

- Node.js `20+` 권장
- `pnpm` 사용 권장 (lockfile: `pnpm-lock.yaml`)

### 2) 의존성 설치

```bash
pnpm install
```

### 3) 개발 서버 실행

```bash
pnpm dev
```

### 4) 프로덕션 빌드/실행

```bash
pnpm build
pnpm start
```

### 5) 린트

```bash
pnpm lint
```

### 6) 테스트 스크립트 현황

현재 `package.json`에는 별도 테스트 스크립트가 정의되어 있지 않습니다.

<a id="environment-variables"></a>
## 환경 변수

`.env.local` 파일을 기준으로 아래 키를 설정합니다.

| 키 | 필수 | 설명 |
| --- | --- | --- |
| `BACKEND_API_URL` | Yes | 백엔드 API 기본 URL |
| `AUTH_SECRET` | Yes | NextAuth 시크릿 |
| `NEXT_PUBLIC_AUTH_KAKAO_ID` | Yes | 카카오 OAuth 클라이언트 ID |
| `NEXT_PUBLIC_AUTH_GOOGLE_ID` | Yes | 구글 OAuth 클라이언트 ID |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Yes (푸시 사용 시) | 웹 푸시 공개 키 |
| `VAPID_PRIVATE_KEY` | Yes (푸시 사용 시) | 웹 푸시 개인 키 |

예시:

```text
BACKEND_API_URL=http://localhost:8080
AUTH_SECRET=replace-with-strong-secret
NEXT_PUBLIC_AUTH_KAKAO_ID=your-kakao-client-id
NEXT_PUBLIC_AUTH_GOOGLE_ID=your-google-client-id
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your-vapid-public-key
VAPID_PRIVATE_KEY=your-vapid-private-key
```

<a id="project-structure"></a>
## 프로젝트 구조

핵심 폴더 기준 깊이 2 요약:

```text
.
├─ public/
│  ├─ icons/
│  └─ sw.js
├─ src/
│  ├─ app/
│  │  ├─ @modal/
│  │  ├─ actions/
│  │  ├─ api/
│  │  ├─ address/
│  │  ├─ auth/
│  │  ├─ body-info/
│  │  ├─ cart/
│  │  ├─ category/
│  │  ├─ login/
│  │  ├─ me/
│  │  ├─ orders/
│  │  ├─ payment/
│  │  ├─ product/
│  │  ├─ review/
│  │  ├─ reviews/
│  │  └─ search/
│  ├─ components/
│  │  ├─ address/
│  │  ├─ cart/
│  │  ├─ layout/
│  │  ├─ product/
│  │  ├─ pwa/
│  │  ├─ reviews/
│  │  ├─ search-bar/
│  │  └─ ui/
│  ├─ config/
│  ├─ hooks/
│  ├─ lib/
│  ├─ locales/
│  ├─ schemas/
│  ├─ store/
│  └─ types/
├─ auth.ts
├─ auth.config.ts
├─ next.config.ts
└─ package.json
```

### `src/app/actions` 도메인 액션 구성

| 도메인 | 파일 | 역할 예시 |
| --- | --- | --- |
| 주소 | `src/app/actions/address.ts` | 배송지 조회/등록/수정/삭제 |
| 장바구니 | `src/app/actions/cart.ts` | 장바구니 CRUD, 카운트 조회 |
| 주문 | `src/app/actions/order.ts` | 주문 생성/조회/취소 |
| 상품 | `src/app/actions/product.ts` | 상품 상세/유사상품/옵션 조회 |
| 리뷰 | `src/app/actions/review.ts` | 단계형 리뷰 작성/조회/요약 |
| 사용자 | `src/app/actions/user.ts` | 내 정보/프로필 이미지 처리 |
| 체형정보 | `src/app/actions/body-info.ts` | 체형정보/사이즈 옵션 처리 |
| 찜 | `src/app/actions/wishlist.ts` | 위시리스트 조회/추가/삭제 |
| 푸시 | `src/app/actions/push.ts` | 구독 저장/삭제/알림 발송 |

### `src/components` 도메인 분리 규칙

- 도메인 단위 폴더(`address`, `cart`, `product`, `reviews` 등) 우선
- 공통 UI는 `src/components/ui`에만 배치
- 데이터 결합 컴포넌트는 `*-container.tsx` 패턴 우선

<a id="route-map"></a>
## 라우트 맵 (요약)

| 경로 | 설명 |
| --- | --- |
| `/` | 홈 (배너/추천 카테고리/추천 상품/브랜드) |
| `/category/[parentId]/[id]` | 카테고리별 상품 목록 |
| `/product/[id]` | 상품 상세 |
| `/search` | 검색 결과 |
| `/cart` | 장바구니 |
| `/payment` | 결제 |
| `/payment/complete` | 결제 완료 |
| `/orders` | 주문 목록 |
| `/orders/[orderId]` | 주문 상세 |
| `/orders/[orderId]/cancel` | 주문 취소 |
| `/me` | 마이페이지 |
| `/me/edit` | 회원정보 수정 |
| `/me/wishlist` | 찜 목록 |
| `/reviews` | 리뷰 목록 |
| `/reviews/detail/[reviewId]` | 리뷰 상세 |
| `/review/write/[reviewId]` | 리뷰 작성 |

<a id="architecture"></a>
## 데이터 흐름/아키텍처 개요

```text
UI Components (src/components/*)
        ↓
Route/Page (src/app/**/page.tsx)
        ↓
Server Actions (src/app/actions/*.ts)
        ↓
API Client (src/lib/api-client.ts)
        ↓
Backend API (BACKEND_API_URL)
```

인증/세션 흐름 요약:

- 인증 진입점: `src/app/api/auth/[...nextauth]/route.ts`, `auth.ts`, `auth.config.ts`
- 세션 전략: JWT
- `jwt` 콜백에서 액세스 토큰 만료 시 리프레시 토큰으로 재발급 시도
- 세션 객체에 `accessToken`, `refreshToken`, 사용자 식별 정보를 주입해 서버 액션에서 사용

<a id="collaboration-guide"></a>
## 협업 가이드

### 이슈/PR 템플릿

- PR 템플릿: `.github/PULL_REQUEST_TEMPLATE.md`
- 이슈 템플릿: `.github/ISSUE_TEMPLATE/feature_request.md`

### PR 체크리스트 요약

- 빌드 테스트 완료 여부 확인
- 코드 컨벤션 준수 여부 확인
- 불필요한 `console.log` 제거 여부 확인
- 주요 플로우 회귀 점검(장바구니/주문/리뷰/마이페이지)

### 커밋 컨벤션

워크플로 가이드 기준 권장 형식:

```text
type: 한국어 설명
```

허용 타입:

- `feat`
- `fix`
- `refactor`
- `docs`
- `style`
- `test`
- `chore`

<a id="troubleshooting"></a>
## 문제 해결 (Troubleshooting)

### 1) 환경 변수 누락

증상:

- 로그인 실패 또는 인증 설정 오류 메시지
- 서버 액션에서 백엔드 호출 실패
- 푸시 구독/발송 실패

점검:

- `.env.local` 존재 여부
- `BACKEND_API_URL`, `AUTH_SECRET`, OAuth/VAPID 키 설정 여부
- 개발 서버 재시작 여부

### 2) 소셜 로그인 콜백 오류

점검:

- OAuth 공급자에 등록된 Redirect URI와 실제 콜백 경로 일치 여부
- 카카오/구글 클라이언트 ID 설정 여부
- 백엔드 인증 엔드포인트 응답 상태 확인

### 3) 푸시 알림 동작 안 함

점검:

- 브라우저의 Service Worker/Notification 지원 여부
- `NEXT_PUBLIC_VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` 설정 여부
- HTTPS 또는 로컬 환경 조건 확인

<a id="license"></a>
## 라이선스/비고

- 라이선스: `미정` (현재 저장소 내 별도 LICENSE 파일 없음)
- 배포 플랫폼/운영 인프라 정보는 문서화되지 않아 본 README에서 단정하지 않습니다.
