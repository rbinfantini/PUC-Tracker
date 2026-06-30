import { Clock3 } from 'lucide-react';
import type { Subject } from '../../types';
import { calculateSubjectGrade, formatGrade, statusLabel } from '../../logic/grades';
import { formatCountdown } from '../../logic/dates';
import { Badge } from '../ui/Badge';

interface SubjectCardProps {
  subject: Subject;
  onOpen: () => void;
}

export function SubjectCard({ subject, onOpen }: SubjectCardProps) {
  const grade = calculateSubjectGrade(subject);
  const next = subject.evaluations
    .filter((evaluation) => evaluation.date && (!evaluation.isPS || grade.shouldShowPs || evaluation.enabled))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))[0];
  const tone = grade.status === 'approved' ? 'green' : grade.status === 'risk' ? 'red' : grade.status === 'no-grades' ? 'gray' : 'blue';
  const checklist = subject.evaluations.filter((evaluation) => !evaluation.isPS || grade.shouldShowPs || evaluation.enabled).slice(0, 8);

  return (
    <button
      className="glass relative w-full overflow-hidden rounded-[26px] p-4 text-left transition active:scale-[0.99]"
      type="button"
      onClick={onOpen}
    >
      <span className="absolute inset-x-0 top-0 h-1.5" style={{ background: subject.color }} />
      {!grade.isPartial && grade.average !== null && grade.average >= subject.minPassGrade ? (
        <span className="absolute right-4 top-4 h-2.5 w-2.5 rounded-full bg-[var(--green)] shadow-[0_0_16px_rgba(48,209,88,0.8)]" />
      ) : null}
      <div className="pr-6">
        <h3 className="truncate text-xl font-bold tracking-tight">{subject.name}</h3>
        {subject.fullName ? <p className="mt-1 line-clamp-2 text-sm leading-5 text-[var(--text-secondary)]">{subject.fullName}</p> : null}
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-3xl font-bold leading-none">{formatGrade(grade.average)}</p>
          <p className="mt-1 text-[11px] font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{grade.isPartial ? 'média parcial' : 'média final'}</p>
        </div>
        <Badge tone={tone}>{statusLabel(grade.status)}</Badge>
      </div>
      <div className="mt-4 flex min-h-5 items-center gap-2 text-sm text-[var(--text-secondary)]">
        <Clock3 size={16} className="shrink-0" />
        <span className="truncate">{next ? `${next.name} — ${formatCountdown(next.date)}` : 'Sem avaliações datadas'}</span>
      </div>
      {checklist.length ? (
        <div className="mt-4 flex gap-1.5 overflow-hidden">
          {checklist.map((evaluation) => {
            const done = evaluation.isDelivery ? evaluation.delivered : evaluation.grade !== null;
            return (
              <span
                key={evaluation.id}
                className="h-2 flex-1 rounded-full"
                style={{ background: done ? subject.color : 'rgba(255,255,255,0.14)' }}
                title={evaluation.name}
              />
            );
          })}
        </div>
      ) : null}
    </button>
  );
}
