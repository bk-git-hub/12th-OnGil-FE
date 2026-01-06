import Link from 'next/link';

export default function MainNavBar() {
  return (
    <div className="font-pretendard sticky bottom-0 flex w-screen items-center justify-around border-t border-[#c3c3c3] bg-white py-3 text-sm font-medium">
      <Link href={'/'} className="flex flex-col items-center">
        <img src="/icons/home.svg" alt="홈으로 이동" width={30} height={30} />홈
      </Link>

      <Link href={'/category'} className="flex flex-col items-center">
        <div className="flex aspect-square w-7.5 items-center justify-center">
          <img
            src="/icons/group.svg"
            alt="카테고리로 이동"
            width={18}
            height={18}
          />
        </div>
        카테고리
      </Link>

      <Link href={'/'} className="flex flex-col items-center">
        <img
          src="/icons/magazine.svg"
          alt="매거진으로 이동"
          width={30}
          height={30}
        />
        매거진
      </Link>

      <Link href={'/'} className="flex flex-col items-center">
        <img src="/icons/heart.svg" alt="찜으로 이동" width={30} height={30} />
        찜 페이지
      </Link>

      <Link href={'/'} className="flex flex-col items-center">
        <img
          src="/icons/profile.svg"
          alt="찜으로 이동"
          width={30}
          height={30}
        />
        마이페이지
      </Link>
    </div>
  );
}
