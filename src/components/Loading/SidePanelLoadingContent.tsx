import { ListItemSkeleton } from './ListItemSkeleton';

export function SidePanelLoadingContent() {
  return (
    <div>
      {Array.from({ length: 8 }).map((_, index) => (
        <ListItemSkeleton key={index} />
      ))}
    </div>
  );
}
