import { Calendar, Pencil, Trash2 } from 'lucide-react';
import type { Evaluation } from '../../types';
import { formatGrade } from '../../logic/grades';
import { formatShortDate } from '../../logic/dates';
import { GradeInput } from './GradeInput';

interface EvaluationListProps {
  title: string;
  evaluations: Evaluation[];
  readOnly?: boolean;
  onGradeChange: (evaluationId: string, grade: number | null) => void;
  onDeliveryChange: (evaluationId: string, delivered: boolean) => void;
  onEdit: (evaluation: Evaluation) => void;
  onDelete: (evaluationId: string) => void;
}

export function EvaluationList({ title, evaluations, readOnly, onGradeChange, onDeliveryChange, onEdit, onDelete }: EvaluationListProps) {
  if (!evaluations.length) return null;

  return (
    <section className="grid gap-3">
      <h3 className="px-1 text-sm font-semibold uppercase tracking-wide text-[var(--text-secondary)]">{title}</h3>
      {evaluations.map((evaluation) => (
        <article key={evaluation.id} className="glass rounded-[24px] p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h4 className="font-bold">{evaluation.name}</h4>
              <p className="mt-1 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <Calendar size={14} />
                {formatShortDate(evaluation.date)}
              </p>
            </div>
            <div className="flex gap-1">
              <button className="rounded-full bg-white/10 p-2 disabled:opacity-40" disabled={readOnly} type="button" onClick={() => onEdit(evaluation)} aria-label="Editar avaliação">
                <Pencil size={15} />
              </button>
              {!evaluation.isPS ? (
                <button className="rounded-full bg-white/10 p-2 text-[var(--red)] disabled:opacity-40" disabled={readOnly} type="button" onClick={() => onDelete(evaluation.id)} aria-label="Excluir avaliação">
                  <Trash2 size={15} />
                </button>
              ) : null}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            {evaluation.isDelivery ? (
              <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                <input type="checkbox" checked={evaluation.delivered} disabled={readOnly} onChange={(event) => onDeliveryChange(evaluation.id, event.target.checked)} />
                {evaluation.delivered ? 'Entregue' : 'Pendente'}
              </label>
            ) : (
              <GradeInput value={evaluation.grade} maxGrade={evaluation.maxGrade} disabled={readOnly} onSave={(grade) => onGradeChange(evaluation.id, grade)} />
            )}
            <span className="text-sm text-[var(--text-secondary)]">/{formatGrade(evaluation.maxGrade)}</span>
          </div>
        </article>
      ))}
    </section>
  );
}
