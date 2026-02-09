import Link from 'next/link';
import { auth } from '/auth';
import { redirect } from 'next/navigation';
import Profile from './profile';

export default async function ProfileSection() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="flex items-center gap-4 px-5 py-6">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100">
          <Profile session={session} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xl font-semibold">
          {session.user.nickName || '사용자'}님
        </span>
        <Link
          href="/me/edit"
          className="bg-ongil-mint text-ongil-teal inline-flex items-center justify-center rounded-full px-4 py-1.5 text-sm font-medium"
        >
          내 정보 수정
        </Link>
      </div>
    </div>
  );
}
