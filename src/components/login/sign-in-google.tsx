import { signIn } from '/auth';

export default function SignInGoogle() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
    >
      <button
        type="submit"
        className="rounded border border-gray-300 bg-white px-4 py-2 text-gray-700 hover:bg-gray-50"
      >
        구글 로그인
      </button>
    </form>
  );
}
