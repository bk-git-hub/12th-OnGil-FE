import { redirect } from 'next/navigation';
import { auth } from '/auth';

export default async function Profile() {
  const session = await auth();
  if (!session) {
    redirect('/login');
  }

  console.log(session);
  return (
    <div>
      {session.user.nickName}
      <img
        src={session.user.profileImageUrl || '/icons/heart.svg'}
        alt="프로필 이미지"
        width={40}
        height={40}
      />
    </div>
  );
}
