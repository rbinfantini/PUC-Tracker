import { Minus, Plus } from 'lucide-react';
import type { Subject } from '../../types';
import { calculateAbsences } from '../../logic/absences';

interface AbsenceControlProps {
  subject: Subject;
  readOnly?: boolean;
  onChange: (delta: number) => void;
}

export function AbsenceControl({ subject, readOnly, onChange }: AbsenceControlProps) {
  const result = calculateAbsences(subject.totalHours, subject.currentAbsences);
  const color = result.status === 'danger' ? 'var(--red)' : result.status === 'warning' ? 'var(--yellow)' : 'var(--green)';

  return (
    <section className="glass rounded-[26px] p-4">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-bold">Faltas</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {subject.currentAbsences} de {result.maxAbsences} permitidas
          </p>
        </div>
        <div className="flex gap-2">
          <button className="rounded-full bg-white/10 p-2 disabled:opacity-40" type="button" disabled={readOnly || subject.currentAbsences <= 0} onClick={() => onChange(-1)}>
            <Minus size={18} />
          </button>
          <button className="rounded-full bg-white/10 p-2 disabled:opacity-40" type="button" disabled={readOnly} onClick={() => onChange(1)}>
            <Plus size={18} />
          </button>
        </div>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full" style={{ width: `${Math.min(100, result.ratioUsed * 100)}%`, background: color }} />
      </div>
      {result.status !== 'ok' ? (
        <p className="mt-3 text-sm" style={{ color }}>
          {result.status === 'danger' ? 'Limite ultrapassado. O app nao bloqueia, apenas alerta.' : 'Atenção: restam 30% ou menos do limite.'}
        </p>
      ) : null}
    </section>
  );
}
