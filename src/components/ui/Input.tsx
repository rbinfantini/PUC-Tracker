import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: ReactNode;
}

export function Input({ label, hint, className = '', ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--text-secondary)]">
      <span className="px-1">{label}</span>
      <input
        className={`min-h-12 rounded-2xl border border-white/10 bg-white/[0.065] px-3.5 text-base text-[var(--text-primary)] outline-none transition focus:border-[var(--accent)] focus:bg-white/[0.085] ${className}`}
        {...props}
      />
      {hint ? <span className="px-1 text-xs text-[var(--text-secondary)]">{hint}</span> : null}
    </label>
  );
}
