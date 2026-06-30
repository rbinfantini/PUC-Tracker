import type { Subject } from '../../types';
import { calculateSubjectGrade, formatGrade } from '../../logic/grades';
import { formatCountdown, formatShortDate } from '../../logic/dates';
import { Modal } from '../ui/Modal';
import { Badge } from '../ui/Badge';

interface ExamModeModalProps {
  open: boolean;
  subject: Subject;
  onClose: () => void;
}

function requiredGradeText(subject: Subject): string {
  const grade = calculateSubjectGrade(subject);
  if (!grade.isPartial || !grade.missing.length) return 'Média fechada ou sem lacunas obrigatórias.';
  const gap = subject.minPassGrade - (grade.worstCase ?? 0);
  if (gap <= 0) return 'Mesmo no pior cenário calculado, a média está acima do mínimo.';
  return `Você precisa recuperar aproximadamente ${formatGrade(gap)} ponto(s) nas pendências.`;
}

export function ExamModeModal({ open, subject, onClose }: ExamModeModalProps) {
  const grade = calculateSubjectGrade(subject);
  const next = subject.evaluations
    .filter((evaluation) => evaluation.date && (!evaluation.isPS || grade.shouldShowPs || evaluation.enabled))
    .sort((a, b) => String(a.date).localeCompare(String(b.date)))[0];
  const pendingDeliveries = subject.evaluations.filter((evaluation) => evaluation.isDelivery && !evaluation.delivered);

  return (
    <Modal open={open} title="Modo Prova" onClose={onClose}>
      <div className="grid gap-4">
        <div className="rounded-[24px] bg-white/[0.06] p-4">
          <p className="text-sm text-[var(--text-secondary)]">{subject.name}</p>
          <h3 className="mt-1 text-2xl font-bold">{next ? next.name : 'Sem próxima avaliação'}</h3>
          <p className="mt-2 text-sm text-[var(--text-secondary)]">
            {next ? `${formatShortDate(next.date)} — ${formatCountdown(next.date)}` : 'Cadastre uma data para aparecer aqui.'}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-[22px] bg-white/[0.06] p-4">
            <p className="text-xs text-[var(--text-secondary)]">Média parcial</p>
            <p className="mt-1 text-2xl font-bold">{formatGrade(grade.average)}</p>
          </div>
          <div className="rounded-[22px] bg-white/[0.06] p-4">
            <p className="text-xs text-[var(--text-secondary)]">Pior cenário</p>
            <p className="mt-1 text-2xl font-bold">{formatGrade(grade.worstCase)}</p>
          </div>
        </div>
        <section>
          <h4 className="mb-2 font-semibold">O que falta</h4>
          <div className="flex flex-wrap gap-2">
            {grade.missing.length ? grade.missing.map((item) => <Badge key={item}>{item}</Badge>) : <Badge tone="green">Nada obrigatório</Badge>}
          </div>
        </section>
        <p className="rounded-[22px] bg-white/[0.06] p-4 text-sm text-[var(--text-secondary)]">{requiredGradeText(subject)}</p>
        {grade.shouldShowPs ? <Badge tone="yellow">PS relevante para esta matéria</Badge> : null}
        {pendingDeliveries.length ? (
          <section>
            <h4 className="mb-2 font-semibold">Entregas pendentes</h4>
            <div className="grid gap-2">
              {pendingDeliveries.map((evaluation) => (
                <p key={evaluation.id} className="rounded-2xl bg-white/[0.06] px-3 py-2 text-sm">
                  {evaluation.name}
                </p>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </Modal>
  );
}
