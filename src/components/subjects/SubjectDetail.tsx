import { useMemo, useState } from 'react';
import { ArrowLeft, ClipboardList, Edit3, Plus, Trash2 } from 'lucide-react';
import type { Evaluation, Subject } from '../../types';
import type { EvaluationInput } from '../../hooks/useAppData';
import { calculateSubjectGrade, formatGrade, statusLabel } from '../../logic/grades';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { AbsenceControl } from './AbsenceControl';
import { EvaluationForm } from './EvaluationForm';
import { EvaluationList } from './EvaluationList';
import { ExamModeModal } from './ExamModeModal';

interface SubjectDetailProps {
  subject: Subject;
  readOnly?: boolean;
  onBack: () => void;
  onEditSubject: () => void;
  onDeleteSubject: () => void;
  onAbsenceChange: (delta: number) => void;
  onAddEvaluation: (input: EvaluationInput) => void;
  onUpdateEvaluation: (evaluationId: string, patch: Partial<Evaluation>) => void;
  onDeleteEvaluation: (evaluationId: string) => void;
  onMarkPS: () => void;
}

export function SubjectDetail({
  subject,
  readOnly,
  onBack,
  onEditSubject,
  onDeleteSubject,
  onAbsenceChange,
  onAddEvaluation,
  onUpdateEvaluation,
  onDeleteEvaluation,
  onMarkPS
}: SubjectDetailProps) {
  const [evaluationFormOpen, setEvaluationFormOpen] = useState(false);
  const [editingEvaluation, setEditingEvaluation] = useState<Evaluation | null>(null);
  const [examOpen, setExamOpen] = useState(false);
  const grade = calculateSubjectGrade(subject);

  const groups = useMemo(() => {
    const visible = subject.evaluations.filter((evaluation) => !evaluation.isPS || evaluation.enabled || grade.shouldShowPs || evaluation.grade !== null);
    return {
      first: visible.filter((evaluation) => evaluation.bimester === 1 && !evaluation.isPS),
      second: visible.filter((evaluation) => evaluation.bimester === 2 && !evaluation.isPS),
      loose: visible.filter((evaluation) => !evaluation.bimester && !evaluation.isPS),
      ps: visible.filter((evaluation) => evaluation.isPS)
    };
  }, [subject.evaluations, grade.shouldShowPs]);

  const submitEvaluation = (input: EvaluationInput | Partial<Evaluation>) => {
    if (editingEvaluation) {
      onUpdateEvaluation(editingEvaluation.id, input as Partial<Evaluation>);
    } else {
      onAddEvaluation(input as EvaluationInput);
    }
    setEditingEvaluation(null);
  };

  const openEditEvaluation = (evaluation: Evaluation) => {
    setEditingEvaluation(evaluation);
    setEvaluationFormOpen(true);
  };

  return (
    <div className="grid gap-5">
      <header className="flex items-center gap-3">
        <button className="rounded-full bg-white/10 p-2" type="button" onClick={onBack} aria-label="Voltar">
          <ArrowLeft size={20} />
        </button>
        <div className="min-w-0">
          <p className="text-sm text-[var(--text-secondary)]">{subject.fullName || subject.name}</p>
          <h1 className="truncate text-2xl font-bold">{subject.name}</h1>
        </div>
      </header>

      <section className="glass rounded-[30px] border-t-4 p-5" style={{ borderTopColor: subject.color }}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">{subject.professor || 'Professor nao informado'}</p>
            <h2 className="mt-1 text-lg font-bold">{subject.gradeModel.toUpperCase()}</h2>
          </div>
          <Badge tone={grade.status === 'approved' ? 'green' : grade.status === 'risk' ? 'red' : 'blue'}>{statusLabel(grade.status)}</Badge>
        </div>
        <div className="mt-5 grid grid-cols-2 gap-3">
          <div className="rounded-[24px] bg-white/[0.06] p-4">
            <p className="text-xs text-[var(--text-secondary)]">{grade.isPartial ? 'MF parcial' : 'MF final'}</p>
            <p className="mt-1 text-3xl font-bold">{formatGrade(grade.average)}</p>
          </div>
          <div className="rounded-[24px] bg-white/[0.06] p-4">
            <p className="text-xs text-[var(--text-secondary)]">Pior cenário</p>
            <p className="mt-1 text-3xl font-bold">{formatGrade(grade.worstCase)}</p>
          </div>
        </div>
        {grade.missing.length ? (
          <div className="mt-4">
            <p className="mb-2 text-sm text-[var(--text-secondary)]">Faltam notas</p>
            <div className="flex flex-wrap gap-2">{grade.missing.map((item) => <Badge key={item}>{item}</Badge>)}</div>
          </div>
        ) : null}
        {grade.psMessage ? <p className="mt-4 text-sm text-[var(--yellow)]">{grade.psMessage}</p> : null}
      </section>

      <AbsenceControl subject={subject} readOnly={readOnly} onChange={onAbsenceChange} />

      <div className="grid grid-cols-2 gap-3">
        <Button disabled={readOnly} icon={<Edit3 size={16} />} type="button" onClick={onEditSubject}>
          Editar
        </Button>
        <Button disabled={readOnly} icon={<Plus size={16} />} type="button" onClick={() => setEvaluationFormOpen(true)}>
          Avaliação
        </Button>
        <Button icon={<ClipboardList size={16} />} type="button" onClick={() => setExamOpen(true)}>
          Modo Prova
        </Button>
        <Button disabled={readOnly} variant="danger" icon={<Trash2 size={16} />} type="button" onClick={onDeleteSubject}>
          Excluir
        </Button>
      </div>

      <Button disabled={readOnly} variant="secondary" type="button" onClick={onMarkPS}>
        Marcar PS / Vou fazer PS
      </Button>

      <EvaluationList title="1º bimestre" evaluations={groups.first} readOnly={readOnly} onGradeChange={(id, gradeValue) => onUpdateEvaluation(id, { grade: gradeValue })} onDeliveryChange={(id, delivered) => onUpdateEvaluation(id, { delivered })} onEdit={openEditEvaluation} onDelete={onDeleteEvaluation} />
      <EvaluationList title="2º bimestre" evaluations={groups.second} readOnly={readOnly} onGradeChange={(id, gradeValue) => onUpdateEvaluation(id, { grade: gradeValue })} onDeliveryChange={(id, delivered) => onUpdateEvaluation(id, { delivered })} onEdit={openEditEvaluation} onDelete={onDeleteEvaluation} />
      <EvaluationList title="Sem bimestre / avulsas" evaluations={groups.loose} readOnly={readOnly} onGradeChange={(id, gradeValue) => onUpdateEvaluation(id, { grade: gradeValue })} onDeliveryChange={(id, delivered) => onUpdateEvaluation(id, { delivered })} onEdit={openEditEvaluation} onDelete={onDeleteEvaluation} />
      <EvaluationList title="PS" evaluations={groups.ps} readOnly={readOnly} onGradeChange={(id, gradeValue) => onUpdateEvaluation(id, { grade: gradeValue, enabled: true })} onDeliveryChange={(id, delivered) => onUpdateEvaluation(id, { delivered })} onEdit={openEditEvaluation} onDelete={onDeleteEvaluation} />

      <EvaluationForm
        open={evaluationFormOpen}
        evaluation={editingEvaluation}
        onClose={() => {
          setEvaluationFormOpen(false);
          setEditingEvaluation(null);
        }}
        onSubmit={submitEvaluation}
      />
      <ExamModeModal open={examOpen} subject={subject} onClose={() => setExamOpen(false)} />
    </div>
  );
}
