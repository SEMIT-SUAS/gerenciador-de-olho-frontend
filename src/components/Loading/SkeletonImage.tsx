import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SkeletonImageProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string | number;
  width?: string | number;
  className?: string;
}

const SkeletonImage = forwardRef<HTMLDivElement, SkeletonImageProps>(
  ({ height = '2.5rem', width = 'auto', className, ...props }, ref) => {
    const formattedHeight = typeof height === 'number' ? `${height}px` : height;
    const formattedWidth = typeof width === 'number' ? `${width}px` : width;

    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-gray-200 dark:bg-gray-700',
          className,
        )}
        style={{
          height: formattedHeight,
          width: formattedWidth,
        }}
        {...props}
      />
    );
  },
);

SkeletonImage.displayName = 'SkeletonImage';

export { SkeletonImage };
