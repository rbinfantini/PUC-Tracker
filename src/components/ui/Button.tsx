import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  icon?: ReactNode;
}

const variants = {
  primary: 'bg-[var(--accent)] text-white shadow-lg shadow-blue-950/30',
  secondary: 'bg-white/8 text-[var(--text-primary)] border border-white/10',
  danger: 'bg-[var(--red)]/15 text-[var(--red)] border border-[var(--red)]/30',
  ghost: 'bg-transparent text-[var(--text-secondary)]'
};

export function Button({ children, className = '', variant = 'secondary', icon, ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}
