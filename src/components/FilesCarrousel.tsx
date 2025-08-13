import { Swiper, SwiperSlide } from 'swiper/react';
import { FileCarrouselItem } from './FileCarrouselItem';
import {
  FileViewerModal,
  type CarrouselFileProps,
} from './Modals/FileViewerModal';
import { useState } from 'react';

interface FilesCarrouselProps {
  files: string[];
}

export function FilesCarrrousel({ files }: FilesCarrouselProps) {
  const [currenctSelectedFile, setCurrentSelectedFile] =
    useState<CarrouselFileProps | null>(null);

  function handleSelectedFile(file: CarrouselFileProps) {
    setCurrentSelectedFile(file);
  }

  return (
    <>
      <Swiper spaceBetween={16} slidesPerView="auto">
        {files.map((fileURL, idx) => {
          return (
            <SwiperSlide key={idx} className="h-40! w-40!">
              <FileCarrouselItem
                fileURL={fileURL}
                onClickInItem={handleSelectedFile}
              />
            </SwiperSlide>
          );
        })}
      </Swiper>

      <FileViewerModal
        file={currenctSelectedFile ? { ...currenctSelectedFile } : null}
        onClose={() => setCurrentSelectedFile(null)}
      />
    </>
  );
}
