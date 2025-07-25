import { Swiper, SwiperSlide } from 'swiper/react';
import type { DenunciaFile } from '../types/DenunciaFile';
import { FileCarrouselItem } from './FileCarrouselItem';
import {
  FileViewerModal,
  type CarrouselFileProps,
} from './Modals/FileViewerModal';
import { useState } from 'react';

interface FilesCarrouselProps {
  files: DenunciaFile[];
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
        {files.map((file) => {
          return (
            <SwiperSlide key={file.id} className="h-40! w-40!">
              <FileCarrouselItem
                file={file}
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
