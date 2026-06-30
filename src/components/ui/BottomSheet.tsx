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
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 px-0 backdrop-blur-sm">
      <section className="glass safe-bottom max-h-[92vh] w-full max-w-[430px] overflow-y-auto rounded-t-[30px] p-5 shadow-[0_-24px_70px_rgba(0,0,0,0.5)]">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/25" />
        <header className="sticky top-0 z-10 -mx-2 mb-4 flex items-center justify-between rounded-3xl bg-[rgba(28,28,35,0.72)] px-2 py-1 backdrop-blur-xl">
          <h2 className="text-xl font-bold tracking-tight">{title}</h2>
          <button className="rounded-full bg-white/10 p-2 text-[var(--text-secondary)] transition active:scale-95" type="button" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </button>
        </header>
        {children}
      </section>
    </div>
  );
}
