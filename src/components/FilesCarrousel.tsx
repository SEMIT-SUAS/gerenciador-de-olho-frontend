import { Swiper, SwiperSlide } from 'swiper/react';
import { API_BASE_URL } from '../config/api';
import { FaImage, FaPlay } from 'react-icons/fa';
import { useState } from 'react';
import { FileViewerModal } from './FileViewerModal';
import type { DenunciaFile } from '../types/DenunciaFile';

interface FilesCarrouselProps {
  files: DenunciaFile[];
}

export function FilesCarrrousel({ files }: FilesCarrouselProps) {
  const [file, setFile] = useState<DenunciaFile | null>(null);

  return (
    <>
      <Swiper
        spaceBetween={16}
        slidesPerView={'auto'}
        className="pb-2 -mx-1 px-1"
      >
        {files &&
          files.map((file) => (
            <SwiperSlide key={file.id} className="!w-40 !h-40">
              <button
                onClick={() => setFile(file)}
                className="relative w-full h-full group bg-gray-200 rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {file.tipo === 'imagem' ? (
                  <img
                    src={`${API_BASE_URL}/files/uploads/${file.nome}`}
                    alt={file.nome}
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800">
                    <FaPlay className="text-white text-4xl opacity-70" />
                  </div>
                )}

                <div className="absolute bottom-1 right-1 bg-black bg-opacity-50 text-white p-1.5 rounded-full">
                  {file.tipo === 'imagem' ? (
                    <FaImage size={12} />
                  ) : (
                    <FaPlay size={12} />
                  )}
                </div>
              </button>
            </SwiperSlide>
          ))}
      </Swiper>

      <FileViewerModal file={file} onClose={() => setFile(null)} />
    </>
  );
}
