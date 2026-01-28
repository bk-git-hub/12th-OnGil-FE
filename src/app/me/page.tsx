import LogoutButton from '@/components/mypage/logout-button';
import Profile from '@/components/mypage/profile';
import UserDetail from '@/components/mypage/user-detail';

export default function Mypage() {
  return (
    <div>
      <Profile />
      <LogoutButton />
      <UserDetail />
    </div>
  );
}
