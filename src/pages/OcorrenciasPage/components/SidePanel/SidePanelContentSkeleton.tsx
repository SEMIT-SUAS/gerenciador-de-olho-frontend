import type { ReactNode } from 'react';

export function SidePanelContentSkeleton({
  backButton,
}: {
  backButton: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2 space-y-4 animate-pulse">
      {backButton}

      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded-md w-32" />
            <div className="h-6 bg-gray-300 rounded-md w-48" />
            <div className="h-4 bg-gray-200 rounded-md w-40" />
          </div>
          <div className="h-8 bg-gray-200 rounded-full w-24" />
        </div>

        <div className="space-y-1">
          <div className="h-4 bg-gray-300 rounded-md w-24" />
          <div className="h-4 bg-gray-200 rounded-md w-full" />
          <div className="h-4 bg-gray-200 rounded-md w-4/5" />
        </div>

        <div className="flex-col border border-gray-200 p-4 rounded-2xl space-y-2">
          <div className="h-4 bg-gray-200 rounded-md w-full" />
          <div className="h-4 bg-gray-200 rounded-md w-3/4" />
        </div>

        <div className="flex items-center px-4 py-3 justify-between bg-gray-100 border border-gray-200 rounded-xl">
          <div className="space-y-2 w-full">
            <div className="h-4 bg-gray-200 rounded-md w-28" />
            <div className="h-5 bg-gray-300 rounded-md w-40" />
            <div className="h-3 bg-gray-200 rounded-md w-32" />
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full" />
        </div>

        <div>
          <div className="h-5 bg-gray-300 rounded-md w-16 mb-2" />
          <div className="h-32 bg-gray-200 rounded-md w-full" />
        </div>

        <div className="flex justify-end">
          <div className="h-10 bg-gray-200 rounded-md w-36" />
        </div>
      </div>
    </div>
  );
}
