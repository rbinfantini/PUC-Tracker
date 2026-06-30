import type { CalendarEvent } from '../../types';
import { formatShortDate } from '../../logic/dates';
import { Badge } from '../ui/Badge';

interface AgendaListProps {
  events: CalendarEvent[];
  onSelect: (event: CalendarEvent) => void;
}

export function AgendaList({ events, onSelect }: AgendaListProps) {
  return (
    <section className="grid gap-3">
      <h2 className="text-lg font-bold tracking-tight">Próximas avaliações</h2>
      {events.length ? (
        events.map((event) => (
          <button key={event.id} className="glass flex items-center gap-3 rounded-[22px] p-4 text-left transition active:scale-[0.99]" type="button" onClick={() => onSelect(event)}>
            <span className="h-12 w-1.5 rounded-full" style={{ background: event.subjectColor }} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold">{event.subjectName} — {event.evaluation.name}</p>
              <p className="mt-0.5 text-sm text-[var(--text-secondary)]">{formatShortDate(event.evaluation.date)}</p>
            </div>
            <Badge>{event.evaluation.type}</Badge>
          </button>
        ))
      ) : (
        <p className="rounded-[24px] border border-dashed border-white/[0.12] bg-white/[0.035] p-5 text-center text-sm leading-5 text-[var(--text-secondary)]">Sem avaliações com data no semestre ativo.</p>
      )}
    </section>
  );
}
