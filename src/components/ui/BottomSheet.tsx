import type { ReactNode } from 'react';
import { X } from 'lucide-react';

interface BottomSheetProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function BottomSheet({ open, title, children, onClose }: BottomSheetProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70">
      <section className="glass safe-bottom max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[32px] p-5">
        <div className="mx-auto mb-4 h-1 w-11 rounded-full bg-white/20" />
        <header className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>
          <button className="rounded-full bg-white/10 p-2 text-[var(--text-secondary)]" type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
