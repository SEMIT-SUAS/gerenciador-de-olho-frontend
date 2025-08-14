// components/ui/color-picker.tsx
'use client';

import { HexColorPicker } from 'react-colorful';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface ColorPickerProps {
  color: string;
  setColor: (color: string) => void;
  className?: string;
}

export function ColorPicker({ color, setColor, className }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !color && 'text-muted-foreground',
            className,
          )}
        >
          <div className="flex w-full items-center gap-2">
            {color ? (
              <div
                className="h-4 w-4 rounded !bg-center !bg-cover transition-all"
                style={{ background: color }}
              />
            ) : (
              <span>Escolha uma cor</span>
            )}
            <div className="flex-1 truncate">
              {color || 'Nenhuma cor selecionada'}
            </div>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <HexColorPicker color={color} onChange={setColor} />
      </PopoverContent>
    </Popover>
  );
}
