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
    <div className="mt-4 flex items-center gap-5 px-4 py-6">
      <div className="relative">
        <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-gray-100">
          <Profile session={session} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-xl leading-normal font-medium">
          {session.user.nickName || '사용자'}님
        </span>
        <Link
          href="/me/edit"
          className="bg-ongil-teal flex items-center justify-center rounded-md px-4 py-1 text-xl font-medium text-white"
        >
          <span>내 정보 수정</span>
        </Link>
      </div>
    </div>
  );
}
