import { signIn } from './../../app/auth';

export default function SignInKakao() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('kakao', { redirectTo: '/' });
      }}
    >
      <button
        type="submit"
        className="rounded bg-yellow-400 px-4 py-2 font-bold text-black"
      >
        카카오 로그인
      </button>
    </form>
  );
}
