import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 px-3 py-4 backdrop-blur-sm sm:items-center">
      <section className="glass safe-bottom max-h-[90vh] w-full max-w-[430px] overflow-y-auto rounded-[28px] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
        <header className="mb-4 flex items-center justify-between gap-3">
          <h2 className="min-w-0 truncate text-xl font-bold tracking-tight">{title}</h2>
          <button className="shrink-0 rounded-full bg-white/10 p-2 text-[var(--text-secondary)] transition active:scale-95" type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
