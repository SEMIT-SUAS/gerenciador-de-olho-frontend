import { Swiper, SwiperSlide } from 'swiper/react';
import { FileCarrouselItem } from './FileCarrouselItem';

interface FilesCarrouselProps {
  filesURLs: string[];
}

export function FilesCarrrousel({ filesURLs }: FilesCarrouselProps) {
  return (
    <>
      <Swiper spaceBetween={16} slidesPerView="auto">
        {filesURLs.map((url) => {
          return (
            <SwiperSlide key={url} className="h-40! w-40!">
              <FileCarrouselItem fileUrl={url} />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </>
  );
}
