import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ label, className = '', children, ...props }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--text-secondary)]">
      <span className="px-1">{label}</span>
      <select
        className={`min-h-12 rounded-2xl border border-white/10 bg-[var(--bg-elevated)] px-3.5 text-base text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
