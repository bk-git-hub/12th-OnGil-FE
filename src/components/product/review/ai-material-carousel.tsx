'use client';
import Image from 'next/image';
import { MaterialDescription } from '@/types/domain/product';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface AiMaterialCarouselProps {
  materialDescription?: MaterialDescription;
  materialName?: string;
}

/**
 * AI 소재 분석 정보를 캐러셀로 표시하는 컴포넌트
 * @param {AiMaterialCarouselProps} props - 컴포넌트 props
 * @param {MaterialDescription} [props.materialDescription] - 소재 설명 정보
 * @param {string} [props.materialName] - 소재 이름
 * @returns {JSX.Element} AI 소재 캐러셀 컴포넌트
 */
export default function AiMaterialCarousel({
  materialDescription,
  materialName,
}: AiMaterialCarouselProps) {
  if (!materialDescription) {
    return (
      <div className="py-10 text-center text-gray-500">
        AI 소재 분석 정보가 없습니다.
      </div>
    );
  }

  const sections = [
    {
      id: 'pros',
      title: '좋은점 ',
      image: '/icons/smile.svg',
      content: materialDescription.advantages,
      iconColor: 'text-blue-500',
    },
    {
      id: 'cons',
      title: '나쁜점 ',
      image: '/icons/sad.svg',
      content: materialDescription.disadvantages,
      iconColor: 'text-red-500',
    },
    {
      id: 'care',
      title: '세탁방법',
      image: '/icons/washing-mc.svg',
      content: materialDescription.care,
      iconColor: 'text-gray-500',
    },
  ];

  return (
    <div className="w-full">
      <div className="mb-10 flex items-center gap-2">
        <h3 className="text-2xl leading-5 font-medium -tracking-[0.08px] not-italic">
          {materialName}
        </h3>
      </div>

      <Carousel
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {sections.map((section) => (
            <CarouselItem
              key={section.id}
              className="pl-2 sm:basis-1/2 md:basis-1/2 lg:basis-1/3"
            >
              <Card
                className={cn(
                  'border-ongil-teal h-full w-full max-w-[330px] gap-2 rounded-none border not-italic shadow-[1px_4px_4px_0px_rgba(0,0,0,0.25)]',
                )}
              >
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center gap-[10px] text-2xl font-normal">
                    <Image
                      src={section.image}
                      alt={section.title}
                      width={39}
                      height={39}
                    />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-4">
                  <ul className="space-y-3">
                    {section.content
                      ?.slice(0, 4)
                      .map((text: string, idx: number) => (
                        <li
                          key={idx}
                          className="text-xl leading-8 font-normal break-keep"
                        >
                          {text}
                        </li>
                      ))}
                  </ul>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
