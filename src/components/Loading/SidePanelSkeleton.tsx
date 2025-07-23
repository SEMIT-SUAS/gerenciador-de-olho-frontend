import { SkeletonItem } from './SkeletonItem';

export function SidePanelSkeleton() {
  return (
    <div className="animate-pulse p-4">
      {Array.from({ length: 6 }).map((_, index) => (
        <SkeletonItem key={index} />
      ))}
    </div>
  );
}
