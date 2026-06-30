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
    <section className="glass rounded-[24px] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div>
          <h3 className="font-bold">Faltas</h3>
          <p className="text-sm text-[var(--text-secondary)]">
            {subject.currentAbsences} de {result.maxAbsences} permitidas
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition active:scale-95 disabled:opacity-40" type="button" disabled={readOnly || subject.currentAbsences <= 0} onClick={() => onChange(-1)} aria-label="Remover falta">
            <Minus size={18} />
          </button>
          <button className="grid h-10 w-10 place-items-center rounded-full bg-white/10 transition active:scale-95 disabled:opacity-40" type="button" disabled={readOnly} onClick={() => onChange(1)} aria-label="Adicionar falta">
            <Plus size={18} />
          </button>
        </div>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-[width]" style={{ width: `${Math.min(100, result.ratioUsed * 100)}%`, background: color }} />
      </div>
      {result.status !== 'ok' ? (
        <p className="mt-3 rounded-2xl px-3 py-2 text-sm" style={{ color, backgroundColor: result.status === 'danger' ? 'rgba(255,69,58,0.1)' : 'rgba(255,214,10,0.1)' }}>
          {result.status === 'danger' ? 'Limite ultrapassado. O app não bloqueia, apenas alerta.' : 'Atenção: restam 30% ou menos do limite.'}
        </p>
      ) : null}
    </section>
  );
}
