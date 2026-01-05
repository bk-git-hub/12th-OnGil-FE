import { auth, signOut } from '/auth';
import SignInKakao from '@/components/login/sign-in-kakao';
import SignInGoogle from '@/components/login/sign-in-google';
import SearchBar from '@/components/search-bar';

export default async function Home() {
  const session = await auth(); //

  if (!session) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <h1 className="mb-4 text-2xl font-bold">로그인이 필요합니다</h1>

        <div className="flex gap-2">
          <SignInKakao />
          <SignInGoogle />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-10">
      <h1 className="text-xl font-bold">환영합니다, {session.user?.name}님!</h1>
      <SearchBar />

      {session.user?.image && (
        <img
          src={session.user.image}
          alt="프로필"
          className="mt-4 h-20 w-20 rounded-full border"
        />
      )}

      <div className="mt-4">
        <p className="text-gray-600">이메일: {session.user?.email}</p>
      </div>

      <form
        action={async () => {
          'use server';
          await signOut();
        }}
      >
        <button
          type="submit"
          className="mt-6 rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          로그아웃
        </button>
      </form>
    </div>
  );
}
