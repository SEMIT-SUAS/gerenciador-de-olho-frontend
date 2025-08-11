import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface ListItemSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  titleWidth?: string;
  subtitleWidth?: string;
  titleHeight?: string | number;
  subtitleHeight?: string | number;
  padding?: string;
  rounded?: string;
  border?: boolean;
}

const ListItemSkeleton = forwardRef<HTMLDivElement, ListItemSkeletonProps>(
  (
    {
      titleWidth = 'w-3/4',
      subtitleWidth = 'w-1/2',
      titleHeight = 'h-4',
      subtitleHeight = 'h-3',
      padding = 'p-3',
      rounded = 'rounded-lg',
      border = true,
      className,
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          'mb-2',
          padding,
          rounded,
          border && 'border border-border',
          className,
        )}
        {...props}
      >
        <Skeleton
          className={cn(
            'mb-2',
            titleWidth,
            typeof titleHeight === 'string' ? titleHeight : '',
          )}
          style={
            typeof titleHeight === 'number'
              ? { height: `${titleHeight}px` }
              : undefined
          }
        />
        <Skeleton
          className={cn(
            subtitleWidth,
            typeof subtitleHeight === 'string' ? subtitleHeight : '',
          )}
          style={
            typeof subtitleHeight === 'number'
              ? { height: `${subtitleHeight}px` }
              : undefined
          }
        />
      </div>
    );
  },
);

ListItemSkeleton.displayName = 'ListItemSkeleton';

export { ListItemSkeleton };
