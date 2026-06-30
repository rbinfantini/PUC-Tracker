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
  const days: Date[] = [];
  for (let day = start; day <= end; day = new Date(day.getFullYear(), day.getMonth(), day.getDate() + 1)) {
    days.push(day);
  }

  return (
    <section className="glass rounded-[30px] p-4">
      <header className="mb-4 flex items-center justify-between">
        <button className="rounded-full bg-white/10 p-2" type="button" onClick={() => onMonthChange(subMonths(month, 1))} aria-label="Mês anterior">
          <ChevronLeft size={18} />
        </button>
        <h2 className="font-bold capitalize">{format(month, 'MMMM yyyy', { locale: ptBR })}</h2>
        <button className="rounded-full bg-white/10 p-2" type="button" onClick={() => onMonthChange(addMonths(month, 1))} aria-label="Próximo mês">
          <ChevronRight size={18} />
        </button>
      </header>
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-[var(--text-secondary)]">
        {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((label, index) => <span key={`${label}-${index}`}>{label}</span>)}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1">
        {days.map((day) => {
          const dayEvents = events.filter((event) => event.evaluation.date && isSameDay(parseISO(event.evaluation.date), day));
          return (
            <button
              key={day.toISOString()}
              className={`min-h-12 rounded-2xl p-1 text-sm ${isSameMonth(day, month) ? 'bg-white/[0.04]' : 'bg-white/[0.015] text-[var(--text-secondary)]'}`}
              type="button"
              onClick={() => dayEvents[0] && onSelect(dayEvents[0])}
            >
              <span>{format(day, 'd')}</span>
              <span className="mt-1 flex justify-center gap-0.5">
                {dayEvents.slice(0, 3).map((event) => <span key={event.id} className="h-1.5 w-1.5 rounded-full" style={{ background: event.subjectColor }} />)}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
