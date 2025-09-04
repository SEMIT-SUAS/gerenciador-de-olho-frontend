import {
  useCallback,
  useState,
  useRef,
  type SetStateAction,
  type Dispatch,
} from 'react';
import { IconPhoto, IconPlus, IconX } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

type MultipleImageInputProps = {
  initialImageUrls?: string[];
  onChange: (files: File[]) => void;
  className?: string;
  maxFiles?: number;
  setDeletedFiles?: Dispatch<SetStateAction<string[] | undefined>>;
  deletedFiles?: string[] | undefined;
};

export function MultipleImageInput({
  initialImageUrls = [],
  onChange,
  className = '',
  maxFiles = 10,
  setDeletedFiles,
  deletedFiles,
}: MultipleImageInputProps) {
  const [previews, setPreviews] = useState<(string | File)[]>(initialImageUrls);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const updateFiles = (newPreviews: (string | File)[]) => {
    setPreviews(newPreviews);
    const updatedFiles = newPreviews.filter(
      (p): p is File => p instanceof File,
    );
    onChange(updatedFiles);
  };

  const handleNewFiles = useCallback(
    (newFiles: File[]) => {
      if (previews.length + newFiles.length > maxFiles) {
        toast.error(`Você pode enviar no máximo ${maxFiles} imagens.`);
        return;
      }
      const validFiles = newFiles.filter((file) =>
        file.type.startsWith('image/'),
      );
      if (validFiles.length !== newFiles.length) {
        toast.warning('Apenas arquivos de imagem são permitidos.');
      }
      if (validFiles.length > 0) {
        updateFiles([...previews, ...validFiles]);
      }
    },
    [previews, maxFiles],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleNewFiles(Array.from(files));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleNewFiles(Array.from(files));
    }
  };

  // const removeImage = (indexToRemove: number, fileName: string) => {
  //   // const urlSemParams = url.split('?')[0];
  //   // const ultimoIndiceBarra = urlSemParams.lastIndexOf('/');
  //   // const fileName = urlSemParams.substring(ultimoIndiceBarra + 1);

  //   if (deletedFiles && setDeletedFiles) {
  //     setDeletedFiles([...deletedFiles, fileName]);
  //     const updatedPreviews = previews.filter(
  //       (_, index) => index !== indexToRemove,
  //     );
  //     updateFiles(updatedPreviews);
  //   }
  // };

  const removeImage = (indexToRemove: number, preview: string | File) => {
    setPreviews((prev) => {
      const removed = prev[indexToRemove];

      // se for URL (imagem antiga) e o pai quiser rastrear, guardamos a URL completa
      if (typeof removed === 'string' && setDeletedFiles) {
        setDeletedFiles((curr) => [...(curr ?? []), removed]);
      }

      const next = prev.filter((_, i) => i !== indexToRemove);

      // propaga novos Files ao formulário
      const onlyFiles = next.filter((p): p is File => p instanceof File);
      onChange(onlyFiles);

      // limpar input para poder reanexar o mesmo arquivo
      if (inputRef.current) inputRef.current.value = '';

      return next;
    });
  };

  const handleDragEvents = (
    e: React.DragEvent<HTMLDivElement>,
    active: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  return (
    <div
      className={cn(
        'w-full min-w-0 h-[220px] overflow-y-auto [scrollbar-gutter:stable]',
        'rounded-lg border-2 border-dashed bg-slate-50 p-4 transition-colors duration-300 dark:bg-slate-800/80',
        dragActive
          ? 'border-blue-500'
          : 'border-slate-300 dark:border-slate-700',
        className,
      )}
      onDrop={handleDrop}
      onDragOver={(e) => handleDragEvents(e, true)}
      onDragLeave={(e) => handleDragEvents(e, false)}
    >
      {previews.length === 0 ? (
        <div
          className="flex cursor-pointer flex-col items-center justify-center gap-2 py-10 text-center text-slate-500"
          onClick={() => inputRef.current?.click()}
        >
          <IconPhoto size={32} />
          <p className="font-medium">Arraste e solte ou clique para enviar</p>
          <p className="text-xs">Máximo de {maxFiles} imagens</p>
        </div>
      ) : (
        //grid fluido que não alarga o container
        <div className="grid grid-cols-[repeat(auto-fill,128px)] justify-start gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="group relative w-[128px] h-[128px] overflow-hidden rounded-lg"
            >
              <img
                src={
                  typeof preview === 'string'
                    ? preview
                    : URL.createObjectURL(preview)
                }
                alt={`Preview ${index + 1}`}
                width={128}
                height={128} // reserva layout
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                onLoad={(e) => {
                  if (preview instanceof File)
                    URL.revokeObjectURL(e.currentTarget.src);
                }}
              />

              {/* overlay não bloqueia clique */}
              <div className="pointer-events-none absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

              <button
                type="button"
                onClick={() => removeImage(index, preview as string)}
                aria-label="Remover imagem"
                className="absolute right-1.5 top-1.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/70 text-slate-800 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-red-500 group-hover:opacity-100"
              >
                <IconX size={16} />
              </button>
            </div>
          ))}

          {previews.length < maxFiles && (
            <label
              htmlFor="image-upload-button"
              className="grid w-[128px] h-[128px] cursor-pointer place-items-center rounded-lg border-2 border-dashed border-slate-300 bg-transparent transition-colors hover:border-blue-500 hover:bg-slate-100 dark:border-slate-600 dark:hover:border-blue-500 dark:hover:bg-slate-700"
            >
              <div className="flex flex-col items-center gap-1 text-slate-400 transition-colors group-hover:text-blue-500">
                <IconPlus size={24} />
                <span className="text-sm font-medium">Adicionar</span>
              </div>
            </label>
          )}
        </div>
      )}

      <Input
        ref={inputRef}
        id="image-upload-button"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
        multiple
      />
    </div>
  );
}
