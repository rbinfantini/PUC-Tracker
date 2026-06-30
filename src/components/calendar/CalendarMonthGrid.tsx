import { addMonths, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, parseISO, startOfMonth, startOfWeek, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarEvent } from '../../types';

interface CalendarMonthGridProps {
  month: Date;
  events: CalendarEvent[];
  onMonthChange: (month: Date) => void;
  onSelect: (event: CalendarEvent) => void;
}

export function CalendarMonthGrid({ month, events, onMonthChange, onSelect }: CalendarMonthGridProps) {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  const end = endOfWeek(endOfMonth(month), { weekStartsOn: 0 });
  const today = new Date();
  const days: Date[] = [];
  for (let day = start; day <= end; day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
    days.push(day);
  }

  return (
    <section className="glass rounded-[28px] p-4">
      <header className="mb-4 flex items-center justify-between">
        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition active:scale-95" type="button" onClick={() => onMonthChange(subMonths(month, 1))} aria-label="Mês anterior">
          <ChevronLeft size={18} />
        </button>
        <h2 className="text-base font-bold capitalize tracking-tight">{format(month, 'MMMM yyyy', { locale: ptBR })}</h2>
        <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition active:scale-95" type="button" onClick={() => onMonthChange(addMonths(month, 1))} aria-label="Próximo mês">
          <ChevronRight size={18} />
        </button>
      </header>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-bold text-[var(--text-secondary)]">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayEvents = events.filter((event) => event.evaluation.date && isSameDay(parseISO(event.evaluation.date), day));
          const inMonth = isSameMonth(day, month);
          const isToday = isSameDay(day, today);
          return (
            <button
              key={day.toISOString()}
              className={`grid min-h-12 place-items-center rounded-2xl p-1 text-sm transition active:scale-95 ${
                inMonth ? 'bg-white/[0.045] text-[var(--text-primary)]' : 'bg-white/[0.018] text-[var(--text-secondary)]'
              } ${isToday ? 'ring-1 ring-[var(--accent)]/70' : ''}`}
              type="button"
              onClick={() => dayEvents[0] && onSelect(dayEvents[0])}
            >
              <span className={`grid h-6 w-6 place-items-center rounded-full ${isToday ? 'bg-[var(--accent)] text-white' : ''}`}>{format(day, 'd')}</span>
              <span className="mt-1 flex h-2 justify-center gap-0.5">
                {dayEvents.slice(0, 3).map((event) => <span key={event.id} className="h-1.5 w-1.5 rounded-full" style={{ background: event.subjectColor }} />)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
