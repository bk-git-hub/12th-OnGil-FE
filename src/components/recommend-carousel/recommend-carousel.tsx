import { Carousel, CarouselContent } from '../ui/carousel';

interface RecommendCarouselProps {
  heading: string;
  children: React.ReactNode;
}

export function RecommendCarousel({
  heading,
  children,
}: RecommendCarouselProps) {
  return (
    <div className="flex w-full flex-col items-center gap-7.5 px-4">
      <h2 className="font-pretendard text-xl font-bold">{heading}</h2>

      <Carousel
        opts={{
          align: 'start',
          dragFree: true,
          containScroll: 'trimSnaps',
        }}
        className="mx-auto w-full max-w-5xl"
      >
        <CarouselContent className="-ml-4">{children}</CarouselContent>
      </Carousel>
    </div>
  );
}
