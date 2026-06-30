import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
}

export function Select({ label, className = '', children, ...props }: SelectProps) {
  return (
    <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
      <span>{label}</span>
      <select
        className={`min-h-11 rounded-2xl border border-white/10 bg-[var(--bg-elevated)] px-3 text-base text-[var(--text-primary)] outline-none focus:border-[var(--accent)] ${className}`}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
