import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  tone?: 'blue' | 'green' | 'yellow' | 'red' | 'gray';
}

const tones = {
  blue: 'bg-[var(--accent)]/15 text-[var(--accent)]',
  green: 'bg-[var(--green)]/15 text-[var(--green)]',
  yellow: 'bg-[var(--yellow)]/15 text-[var(--yellow)]',
  red: 'bg-[var(--red)]/15 text-[var(--red)]',
  gray: 'bg-white/10 text-[var(--text-secondary)]'
};

export function Badge({ children, tone = 'gray' }: BadgeProps) {
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}>{children}</span>;
}
