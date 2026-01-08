'use client';

import { useState } from 'react';
import Link from 'next/link'; // Link 태그 추가
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useCarouselDots } from './use-carousel-dots';
import { DotNavigation } from './dot-navigation';
import Autoplay from 'embla-carousel-autoplay';

export function CarouselWithDots() {
  const [api, setApi] = useState<CarouselApi>();
  const { current, count, scrollTo } = useCarouselDots(api);

  const bannerContent = [
    {
      title: '“프롬프트 엔지니어링 (aka 구걸)”',
      desc: '"제발 한 번만 돌아가게 해줘"라고 정중하게 부탁해서 얻어낸 코드입니다. AI는 예의 바른 사람을 좋아하거든요.',
      handle: '@bk-git-hub',
      link: 'https://github.com/bk-git-hub',
    },
    {
      title: '“버그는 죽지 않는다, 다만 숨을 뿐”',
      desc: '버그는 우리와 함께 살아가는 동반자입니다. 죽이려 하지 마세요. 그냥 다른 곳으로 옮기세요.',
      handle: '@Seoje1405',
      link: 'https://github.com/Seoje1405',
    },
    {
      title: '“할루시네이션도 하나의 기능입니다”',
      desc: 'AI가 존재하지 않는 라이브러리를 사용했다고요? 그건 저희가 앞으로 만들겠다는 미래지향적 비전입니다.',
      handle: '@bk-git-hub',
      link: 'https://github.com/bk-git-hub',
    },
    {
      title: '“커밋 메시지 ‘fix’는 기도의 한 종류”',
      desc: '아무것도 안 고쳤지만 제발 이번엔 배포가 성공하길 바라는 개발자의 간절한 염원입니다.',
      handle: 'Seoje1405',
      link: 'https://github.com/Seoje1405',
    },

    {
      title: '“완벽한 코드는 배포하지 않은 코드”',
      desc: '세상에 돌아가는 쓰레기는 있어도 완벽한 코드는 없습니다. 돌아가면 일단 퇴근하십시오.',
      handle: '@bk-git-hub',
      link: 'https://github.com/bk-git-hub',
    },
  ];

  return (
    <div className="w-screen max-w-200">
      <Carousel
        setApi={setApi}
        opts={{
          loop: true,
        }}
        plugins={[
          Autoplay({
            delay: 3000,
            stopOnInteraction: false,
          }),
        ]}
      >
        <CarouselContent className="m-0 max-h-125 w-full">
          {bannerContent.map((item, i) => (
            <CarouselItem key={i} className="p-0">
              <Link
                href={item.link}
                target="_blank"
                className="block h-full w-full transition-transform outline-none active:scale-95"
              >
                <div className="bg-card text-card-foreground hover:bg-accent flex aspect-380/275 h-full w-full flex-col items-center justify-center border-4 p-6 text-center transition-colors">
                  <span className="mb-2 text-xs font-bold tracking-widest uppercase opacity-60">
                    {item.handle}
                  </span>
                  <h3 className="mb-4 text-2xl font-black break-keep italic underline decoration-yellow-400 underline-offset-4">
                    {item.title}
                  </h3>
                  <p className="text-lg font-medium break-keep opacity-90">
                    {item.desc}
                  </p>
                  <span className="mt-4 text-[10px] font-bold opacity-40 group-hover:opacity-100">
                    CLICK TO VISIT GITHUB
                  </span>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
      <DotNavigation count={count} current={current} onDotClick={scrollTo} />
    </div>
  );
}
