import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-white/[0.04] border border-white/[0.07] rounded-2xl p-6 ${className}`}
    >
      {children}
    </div>
  );
}
