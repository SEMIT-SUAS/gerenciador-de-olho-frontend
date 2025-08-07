import type { ReactNode } from 'react';
import { Navbar } from '../components/Navbar';

type LayoutPageProps = { children: ReactNode; additionalStyles?: string };

export function LayoutPage({ children, additionalStyles }: LayoutPageProps) {
  return (
    <div
      className={`min-h-screen flex flex-col gap-5 ${additionalStyles || ''}`}
    >
      <Navbar />
      {children}
    </div>
  );
}
