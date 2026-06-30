import type { HTMLAttributes } from 'react';

export function Card({ className = '', ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`glass rounded-[26px] p-4 sm:p-5 ${className}`} {...props} />;
}
