import { api } from '@/lib/api-client';
import { UserInfoResDto } from '@/types/domain/user';

export default async function PointSection() {
  const user = await api.get<UserInfoResDto>('/users/me');

  const formattedPoints = user.points.toLocaleString();

  return (
    <div className="mx-5 rounded-lg border border-black py-4">
      <div className="text-center">
        <p className="mb-1 text-2xl leading-normal font-medium">내 포인트</p>
        <p className="text-2xl leading-9 font-bold">
          {formattedPoints}P <span>🪙</span>
        </p>
      </div>
    </div>
  );
}
