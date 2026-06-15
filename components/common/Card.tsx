import { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div 
      className={`bg-suwon-cardDark rounded-card p-4 shadow-lg border-l-4 border-suwon-red/80 hover:border-suwon-red transition-all ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
