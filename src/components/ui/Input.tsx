import type { InputHTMLAttributes, ReactNode } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hint?: ReactNode;
}

export function Input({ label, hint, className = '', ...props }: InputProps) {
  return (
    <label className="grid gap-2 text-sm text-[var(--text-secondary)]">
      <span>{label}</span>
      <input
        className={`min-h-11 rounded-2xl border border-white/10 bg-white/[0.06] px-3 text-base text-[var(--text-primary)] outline-none focus:border-[var(--accent)] ${className}`}
        {...props}
      />
      {hint ? <span className="text-xs text-[var(--text-secondary)]">{hint}</span> : null}
    </label>
  );
}
