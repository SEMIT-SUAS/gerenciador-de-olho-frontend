import { cn } from '@/lib/utils';
import { forwardRef } from 'react';

interface SkeletonItemProps extends React.HTMLAttributes<HTMLDivElement> {
  titleWidth?: string;
  subtitleWidth?: string;
  titleHeight?: string | number;
  subtitleHeight?: string | number;
  padding?: string;
  rounded?: string;
  border?: boolean;
}

const SkeletonItem = forwardRef<HTMLDivElement, SkeletonItemProps>(
  (
    {
      titleWidth = '3/4',
      subtitleWidth = '1/2',
      titleHeight = '1rem',
      subtitleHeight = '0.75rem',
      padding = 'p-3',
      rounded = 'rounded-lg',
      border = true,
      className,
      ...props
    },
    ref,
  ) => {
    const formatHeight = (value: string | number) => {
      if (typeof value === 'number') return `${value}px`;
      return value;
    };

    return (
      <div
        ref={ref}
        className={cn(
          'mb-2',
          padding,
          rounded,
          border && 'border border-gray-200',
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            'bg-gray-200 dark:bg-gray-700 animate-pulse rounded mb-2',
            `w-${titleWidth}`,
          )}
          style={{ height: formatHeight(titleHeight) }}
        />
        <div
          className={cn(
            'bg-gray-200 dark:bg-gray-700 animate-pulse rounded',
            `w-${subtitleWidth}`,
          )}
          style={{ height: formatHeight(subtitleHeight) }}
        />
      </div>
    );
  },
);

SkeletonItem.displayName = 'SkeletonItem';

export { SkeletonItem };
