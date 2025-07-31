import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
  useCallback,
} from 'react';
import { useOcorrencias } from './OcorrenciasContext';
import type { DenunciaFile } from '@/types/DenunciaFile';
import arquivoService from '@/services/arquivoService';
import { generateThumbnailUrl } from '@/utils/video';

type FileProps = {
  identifier: number;
  thumbnailURL: string;
  fileURL: string;
};

type FilesContextProps = {
  files: FileProps[];
  getFileById: (id: number) => FileProps | undefined;
};

const FilesContext = createContext<FilesContextProps | undefined>(undefined);

export function FilesProvider({ children }: { children: ReactNode }) {
  const { denuncias } = useOcorrencias();
  const [files, setFiles] = useState<FileProps[]>([]);

  async function loadFileWithFallback(file: DenunciaFile) {
    try {
      const blob = await arquivoService.getByName(file.nome);
      const thumbnailURL = await generateThumbnailUrl(blob);

      return {
        identifier: file.id,
        thumbnailURL,
        fileURL: URL.createObjectURL(blob),
      };
    } catch (error) {
      console.error(`Failed to load file ${file.nome}:`, error);
      return {
        identifier: file.id,
        thumbnailURL: '/image_fail_to_fetch.png',
        fileURL: '/image_fail_to_fetch.png',
      };
    }
  }

  const cacheFiles = useCallback(async (filesToCache: DenunciaFile[]) => {
    try {
      const cachedFiles = await Promise.all(
        filesToCache.map(loadFileWithFallback),
      );

      setFiles((prevFiles) => [...prevFiles, ...cachedFiles]);
    } catch (error) {
      console.error('Error caching files:', error);
    }
  }, []);

  useEffect(() => {
    denuncias.forEach((d) => {
      cacheFiles(d.files);
    });
  }, [denuncias, cacheFiles]);

  const getFileById = useCallback(
    (id: number) => files.find((file) => file.identifier === id),
    [files],
  );

  return (
    <FilesContext.Provider value={{ files, getFileById }}>
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFiles must be used within a FilesProvider');
  }
  return context;
}
