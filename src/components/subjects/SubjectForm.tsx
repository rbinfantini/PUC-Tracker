import { FormEvent, useEffect, useState } from 'react';
import type { GradeModel, Subject } from '../../types';
import type { SubjectInput } from '../../hooks/useAppData';
import { SUBJECT_COLORS } from '../../data/initialData';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface SubjectFormProps {
  open: boolean;
  subject?: Subject | null;
  onClose: () => void;
  onSubmit: (input: SubjectInput) => void;
}

const models: Array<{ value: GradeModel; label: string }> = [
  { value: 'peso1', label: 'Peso 1' },
  { value: 'peso2', label: 'Peso 2' },
  { value: 'peso3', label: 'Peso 3' },
  { value: 'lisbete', label: 'Lisbete' }
];

function parsePositiveNumber(value: string): number | null {
  const parsed = Number(value.trim().replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function SubjectForm({ open, subject, onClose, onSubmit }: SubjectFormProps) {
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [professor, setProfessor] = useState('');
  const [color, setColor] = useState(SUBJECT_COLORS[0]);
  const [gradeModel, setGradeModel] = useState<GradeModel>('peso1');
  const [totalHours, setTotalHours] = useState('80');
  const [minPassGrade, setMinPassGrade] = useState('5');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(subject?.name ?? '');
    setFullName(subject?.fullName ?? '');
    setProfessor(subject?.professor ?? '');
    setColor(subject?.color ?? SUBJECT_COLORS[0]);
    setGradeModel(subject?.gradeModel ?? 'peso1');
    setTotalHours(String(subject?.totalHours ?? 80));
    setMinPassGrade(String(subject?.minPassGrade ?? 5).replace('.', ','));
    setError('');
  }, [open, subject]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsedHours = parsePositiveNumber(totalHours);
    const parsedMinPassGrade = parsePositiveNumber(minPassGrade);

    if (!name.trim()) {
      setError('Informe o nome curto da matéria.');
      return;
    }
    if (!parsedHours) {
      setError('Informe uma carga horária maior que zero.');
      return;
    }
    if (!parsedMinPassGrade) {
      setError('Informe uma nota mínima maior que zero.');
      return;
    }

    onSubmit({
      name,
      fullName,
      professor,
      color,
      gradeModel,
      totalHours: parsedHours,
      minPassGrade: parsedMinPassGrade
    });
    onClose();
  };

  return (
    <BottomSheet open={open} title={subject ? 'Editar matéria' : 'Nova matéria'} onClose={onClose}>
      <form className="grid gap-4" onSubmit={submit}>
        <Input label="Nome curto" required value={name} onChange={(event) => setName(event.target.value)} placeholder="EDL" />
        <Input label="Nome completo" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Estrutura de Dados Linear" />
        <Input label="Professor" value={professor} onChange={(event) => setProfessor(event.target.value)} placeholder="Opcional" />
        <div className="grid gap-2 text-sm font-medium text-[var(--text-secondary)]">
          <span className="px-1">Cor</span>
          <div className="grid grid-cols-5 gap-2.5 rounded-3xl bg-white/[0.045] p-3">
            {SUBJECT_COLORS.map((option) => (
              <button
                key={option}
                className={`h-9 rounded-full border-2 transition active:scale-95 ${color === option ? 'border-white shadow-[0_0_0_4px_rgba(255,255,255,0.08)]' : 'border-white/10'}`}
                style={{ background: option }}
                type="button"
                onClick={() => setColor(option)}
                aria-label={`Escolher cor ${option}`}
              />
            ))}
          </div>
        </div>
        <Select label="Modelo de média" value={gradeModel} onChange={(event) => setGradeModel(event.target.value as GradeModel)}>
          {models.map((model) => (
            <option key={model.value} value={model.value}>
              {model.label}
            </option>
          ))}
        </Select>
        <div className="grid grid-cols-2 gap-3">
          <Input label="Carga horária" inputMode="numeric" required value={totalHours} onChange={(event) => setTotalHours(event.target.value)} />
          <Input label="Nota mínima" inputMode="decimal" required value={minPassGrade} onChange={(event) => setMinPassGrade(event.target.value)} />
        </div>
        {error ? <p className="rounded-2xl border border-[var(--red)]/20 bg-[var(--red)]/10 px-3 py-2 text-sm text-[var(--red)]">{error}</p> : null}
        <Button type="submit" variant="primary" className="mt-1">
          Salvar matéria
        </Button>
      </form>
    </BottomSheet>
  );
}
