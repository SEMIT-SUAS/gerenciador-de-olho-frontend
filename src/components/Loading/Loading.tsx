import { ImSpinner2 } from 'react-icons/im';

type LoadingProps = {
  className?: string;
};

export function Loading({ className }: LoadingProps) {
  return (
    <ImSpinner2
      className={`animate-spin text-gray-500 mx-auto size-8 ${className}`}
    />
  );
}
