import { useCallback, useState, useRef, useEffect } from 'react';
import { IconPhoto, IconX } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import 'leaflet/dist/leaflet.css';

type ImageInputProps = {
  value?: File | string | null;
  onChange?: (file: File | undefined) => void;
  className?: string;
  initialImageUrl?: string;
  width?: string | number; // Nova prop para largura
  height?: string | number; // Nova prop para altura
  aspectRatio?: string; // Nova prop para aspect ratio (ex: "16/9")
};

export function ImageInput({
  value = null,
  onChange,
  className = '',
  initialImageUrl,
  width = '100%', // Valor padrão
  height = 'auto', // Valor padrão
  aspectRatio, // Opcional
}: ImageInputProps) {
  const [dragActive, setDragActive] = useState(false);
  const [isImageRemoved, setIsImageRemoved] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const getPreviewUrl = (): string | null => {
    if (isImageRemoved) return null;
    if (value) {
      return typeof value === 'string' ? value : URL.createObjectURL(value);
    }
    return initialImageUrl || null;
  };

  const previewUrl = getPreviewUrl();

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (file && !file.type.startsWith('image/')) {
        toast.error('Por favor, envie um arquivo de imagem.');
        return;
      }
      setIsImageRemoved(!file);
      onChange?.(file);
    },
    [onChange],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const removeImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    handleFile(undefined);
  };

  const handleDragEvents = (
    e: React.DragEvent<HTMLLabelElement>,
    active: boolean,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  };

  useEffect(() => {
    if (value) {
      setIsImageRemoved(false);
    }
  }, [value]);

  // Estilos dinâmicos baseados nas props
  const containerStyle = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  const labelStyle = {
    aspectRatio: aspectRatio ? aspectRatio : undefined,
  };

  return (
    <div className={cn('relative', className)} style={containerStyle}>
      <label
        htmlFor="single-image-upload"
        className={cn(
          'group relative flex cursor-pointer w-full h-full items-center justify-center rounded-lg border-2 border-dashed transition-colors duration-300 overflow-hidden',
          {
            'border-blue-500 bg-slate-50 dark:bg-slate-800/80': dragActive,
            'border-slate-300 hover:border-blue-500 dark:border-slate-700 dark:hover:bg-slate-800/80':
              !dragActive,
          },
        )}
        style={labelStyle}
        onDrop={handleDrop}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
      >
        {previewUrl ? (
          <>
            <img
              src={previewUrl}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <button
              type="button"
              onClick={removeImage}
              aria-label="Remover imagem"
              className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-white/70 text-slate-800 opacity-0 backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-red-500 group-hover:opacity-100"
            >
              <IconX size={18} />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-500 transition-colors group-hover:text-blue-500 dark:text-slate-400">
            <IconPhoto size={32} />
            <p className="font-medium">Enviar imagem</p>
            <p className="text-xs">Arraste e solte ou clique</p>
          </div>
        )}
      </label>
      <Input
        ref={inputRef}
        id="single-image-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
