import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`glass rounded-[28px] p-4 ${className}`} {...props} />;
}
