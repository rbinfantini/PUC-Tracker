import type { ReactNode } from 'react';
import type { TabKey } from '../../types';
import { BottomNav } from './BottomNav';

interface AppShellProps {
  children: ReactNode;
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
}

export function AppShell({ children, activeTab, onTabChange }: AppShellProps) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[430px] border-x border-white/[0.04] bg-[rgba(10,10,15,0.78)]">
      <main className="min-h-screen px-4 pb-28 pt-5">{children}</main>
      <BottomNav active={activeTab} onChange={onTabChange} />
    </div>
  );
}
