import { CalendarDays, History, Home, Settings } from 'lucide-react';
import type { TabKey } from '../../types';

interface BottomNavProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
}

const items = [
  { key: 'home' as const, label: 'Início', icon: Home },
  { key: 'calendar' as const, label: 'Calendário', icon: CalendarDays },
  { key: 'history' as const, label: 'Histórico', icon: History },
  { key: 'settings' as const, label: 'Config', icon: Settings }
];

export function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="safe-bottom fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-white/10 bg-black/80 px-3 pt-2 shadow-[0_-18px_44px_rgba(0,0,0,0.35)] backdrop-blur-2xl">
      <div className="grid grid-cols-4 gap-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              className={`grid min-h-[54px] place-items-center gap-1 rounded-[18px] px-1.5 py-2 text-[11px] font-semibold leading-none transition active:scale-[0.98] ${
                isActive ? 'bg-[var(--accent)]/15 text-[var(--accent)] shadow-inner shadow-white/5' : 'text-[var(--text-secondary)]'
              }`}
              type="button"
              onClick={() => onChange(item.key)}
            >
              <Icon size={21} strokeWidth={isActive ? 2.4 : 2} />
              <span className="max-w-full truncate">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
