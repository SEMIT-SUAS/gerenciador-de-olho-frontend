import { type ReactNode, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';

interface SidePanelProps {
  children: ReactNode;
}

export function SidePanel({ children }: SidePanelProps) {
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <Card
      className={cn(
        'absolute left-0 top-0 z-30 h-full bg-white shadow-xl border-l border-gray-200 transition-all duration-300 rounded-l-none',
        isMinimized ? 'w-[18px]' : 'w-[480px]',
      )}
    >
      <Button
        variant="secondary"
        size="icon"
        className="absolute -right-4 top-[50%] z-40 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 w-8 h-8"
        onClick={() => setIsMinimized(!isMinimized)}
      >
        {isMinimized ? (
          <IconChevronRight size={22} color="#000" />
        ) : (
          <IconChevronLeft size={22} color="#000" />
        )}
      </Button>

      <div
        className={cn(
          'h-full transition-opacity duration-300',
          isMinimized ? 'opacity-0 pointer-events-none' : 'opacity-100',
        )}
      >
        <CardHeader className="border-b">
          <h1 className="text-lg font-semibold">Gerenciador DONC</h1>
        </CardHeader>

        <CardContent className={cn('p-8 overflow-y-auto h-[calc(100%-80px)]')}>
          {children}
        </CardContent>
      </div>

      <div
        className={cn(
          'absolute inset-0 h-full flex items-center justify-center transition-opacity duration-300',
          isMinimized ? 'opacity-100' : 'opacity-0 pointer-events-none',
        )}
      />
    </Card>
  );
}
