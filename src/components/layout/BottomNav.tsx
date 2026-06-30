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
    <nav className="safe-bottom fixed bottom-0 left-1/2 z-40 w-full max-w-[430px] -translate-x-1/2 border-t border-white/10 bg-black/70 px-3 pt-2 backdrop-blur-2xl">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.key;

          return (
            <button
              key={item.key}
              className={`grid place-items-center gap-1 rounded-2xl px-2 py-2 text-[11px] font-semibold transition ${
                isActive ? 'bg-white/10 text-[var(--accent)]' : 'text-[var(--text-secondary)]'
              }`}
              type="button"
              onClick={() => onChange(item.key)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
