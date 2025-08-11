// contexts/FilesContext.tsx

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

// ... (definições de tipo FileProps e FilesContextProps permanecem as mesmas) ...
type FileProps = {
  identifier: number;
  thumbnailURL: string;
  fileURL: string;
};

type FilesContextProps = {
  files: FileProps[];
  getFileById: (id: number) => FileProps | undefined;
  isLoading: boolean;
};

const FilesContext = createContext<FilesContextProps | undefined>(undefined);

export function FilesProvider({ children }: { children: ReactNode }) {
  const { denuncias } = useOcorrencias();
  const [files, setFiles] = useState<FileProps[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadFileWithFallback = useCallback(
    async (file: DenunciaFile): Promise<FileProps> => {
      try {
        const response = await fetch(file.url);
        if (!response.ok) {
          throw new Error(`Falha no fetch da URL: ${file.url}`);
        }
        const blob = await response.blob();

        const isVideo = file.tipo.startsWith('video');
        const thumbnailURL = isVideo
          ? await generateThumbnailUrl(blob)
          : URL.createObjectURL(blob);

        return {
          identifier: file.id,
          thumbnailURL,
          fileURL: URL.createObjectURL(blob),
        };
      } catch (error) {
        console.error(`Falha ao carregar o arquivo da URL ${file.url}:`, error);
        return {
          identifier: file.id,
          thumbnailURL: '/image_fail_to_fetch.png',
          fileURL: '#',
        };
      }
    },
    [],
  );

  const cacheFiles = useCallback(
    async (filesToCache: DenunciaFile[]) => {
      if (filesToCache.length === 0) return;

      setIsLoading(true);
      try {
        const cachedFiles = await Promise.all(
          filesToCache.map(loadFileWithFallback),
        );

        setFiles((prevFiles) => [...prevFiles, ...cachedFiles]);
      } catch (error) {
        console.error('Erro ao cachear arquivos:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [loadFileWithFallback],
  );

  // 2. useEffect foi adaptado para o novo fluxo
  useEffect(() => {
    // Função assíncrona para buscar e processar os arquivos
    const fetchAndCacheFiles = async () => {
      if (denuncias.length === 0) return;

      const cachedFileIds = new Set(files.map((f) => f.identifier));

      // Busca a lista de arquivos para CADA denúncia em paralelo
      const promises = denuncias.map((d) =>
        arquivoService.getFilesByDenunciaId(d.id),
      );

      const results = await Promise.all(promises);

      // Achata o array de arrays (DenunciaFile[][]) para um único array (DenunciaFile[])
      // E filtra apenas os arquivos que ainda não estão no cache
      const allFilesFromAPI = results.flat();
      const filesToCache = allFilesFromAPI.filter(
        (file) => file && !cachedFileIds.has(file.id),
      );

      if (filesToCache.length > 0) {
        await cacheFiles(filesToCache);
      }
    };

    fetchAndCacheFiles();
    // A dependência de `denuncias` garante que isso rode quando as ocorrências carregarem.
    // A dependência de `files` foi removida para evitar loops, a lógica de checagem já está no Set.
  }, [denuncias, cacheFiles]);

  const getFileById = useCallback(
    (id: number) => files.find((file) => file.identifier === id),
    [files],
  );

  return (
    <FilesContext.Provider value={{ files, getFileById, isLoading }}>
      {children}
    </FilesContext.Provider>
  );
}

export function useFiles() {
  const context = useContext(FilesContext);
  if (!context) {
    throw new Error('useFiles deve ser usado dentro de um FilesProvider');
  }
  return context;
}
