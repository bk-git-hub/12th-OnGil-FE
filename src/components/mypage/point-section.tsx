import { api } from '@/lib/api-client';
import { UserInfoResDto } from '@/types/domain/user';

export default async function PointSection() {
  const user = await api.get<UserInfoResDto>('/users/me');

  const formattedPoints = user.points.toLocaleString();

  return (
    <div className="mx-5 rounded-lg border border-gray-200 px-5 py-4">
      <div className="text-center">
        <p className="mb-2 text-base font-medium text-gray-700">내 포인트</p>
        <p className="text-2xl font-bold">
          {formattedPoints}P <span className="text-xl">🪙</span>
        </p>
      </div>
    </div>
  );
}
