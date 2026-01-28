import { signOut } from '/auth';

export default function LogoutButton() {
  return (
    <form
      action={async () => {
        'use server';
        await signOut({ redirectTo: '/' });
      }}
    >
      <button className="text-sm font-medium text-gray-600 hover:cursor-pointer hover:text-gray-900">
        로그아웃
      </button>
    </form>
  );
}
