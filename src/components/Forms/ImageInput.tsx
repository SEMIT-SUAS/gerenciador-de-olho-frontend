import { useCallback, useState } from 'react';
import { IconImageInPicture, IconX } from '@tabler/icons-react';
import { Input } from '@/components/ui/input';
import { toast } from 'react-toastify';

type ImageInputProps = {
  initialImageUrl?: string;
  onChange: (file: File | undefined) => void;
  className?: string;
};

export function ImageInput({
  initialImageUrl,
  onChange,
  className = '',
}: ImageInputProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialImageUrl || null,
  );

  const handleImageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      const file = e.target.files?.[0];

      if (!file) return;

      if (!file.type.includes('image')) {
        toast.error('Por favor, envie um arquivo de imagem');
        return;
      }

      onChange(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result?.toString() || null);
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleImageDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const file = e.dataTransfer.files?.[0];
      if (!file) return;

      if (!file.type.includes('image')) {
        toast.error('Por favor, envie um arquivo de imagem');
        return;
      }

      onChange(file);

      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target?.result?.toString() || null);
      };
      reader.readAsDataURL(file);
    },
    [onChange],
  );

  const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.add('bg-gray-50', 'border-blue-500');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.classList.remove('bg-gray-50', 'border-blue-500');
  };

  const removeImage = () => {
    setImagePreview(null);
    onChange(undefined);
  };

  return (
    <div className={className}>
      {imagePreview ? (
        <div className="relative group">
          <img
            src={imagePreview}
            alt="Preview"
            className="w-full h-48 object-cover rounded-lg"
          />
          <button
            type="button"
            onClick={removeImage}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
          >
            <IconX className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label
            className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleImageDrop}
          >
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <IconImageInPicture className="h-10 w-10 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500">
                Clique para enviar ou arraste uma imagem
              </p>
              <p className="text-xs text-gray-400">
                Formatos suportados: JPG, PNG, GIF
              </p>
            </div>
            <Input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
      )}
    </div>
  );
}
