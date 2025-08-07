import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ImageSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  height?: string | number;
  width?: string | number;
  className?: string;
}

const ImageSkeleton = forwardRef<HTMLDivElement, ImageSkeletonProps>(
  ({ height = 'h-10', width = 'w-auto', className, ...props }, ref) => {
    return (
      <Skeleton
        ref={ref}
        className={cn(
          'rounded-md',
          typeof height === 'string' ? height : '',
          typeof width === 'string' ? width : '',
          className,
        )}
        style={{
          ...(typeof height === 'number' ? { height: `${height}px` } : {}),
          ...(typeof width === 'number' ? { width: `${width}px` } : {}),
        }}
        {...props}
      />
    );
  },
);

ImageSkeleton.displayName = 'ImageSkeleton';

export { ImageSkeleton };
