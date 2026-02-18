import { redirect } from 'next/navigation';
import { Session } from 'next-auth';
import Image from 'next/image';
import { UserRound } from 'lucide-react';

interface ProfileProps {
  session: Session | null;
}

export default function Profile({ session }: ProfileProps) {
  if (!session) {
    redirect('/login');
  }

  const userImage = session.user.profileUrl;

  return (
    <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100">
      {userImage ? (
        <Image
          src={userImage}
          alt="프로필 이미지"
          className="h-full w-full object-cover"
          width={64}
          height={64}
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center">
          <UserRound
            aria-hidden="true"
            className="h-10 w-10 text-gray-600"
            strokeWidth={2.1}
          />
        </div>
      )}
    </div>
  );
}
