import { api } from '@/lib/api-client';
import { UserInfoResDto } from '@/types/domain/user';

export default async function UserDetail() {
  const data = await api.get<UserInfoResDto>('/users/me');

  return (
    <div>
      {data.name}
      <img src={data.profileUrl} alt="프사" />
    </div>
  );
}
