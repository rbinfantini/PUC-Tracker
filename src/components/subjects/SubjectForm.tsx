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

export function SubjectForm({ open, subject, onClose, onSubmit }: SubjectFormProps) {
  const [name, setName] = useState('');
  const [fullName, setFullName] = useState('');
  const [professor, setProfessor] = useState('');
  const [color, setColor] = useState(SUBJECT_COLORS[0]);
  const [gradeModel, setGradeModel] = useState<GradeModel>('peso1');
  const [totalHours, setTotalHours] = useState(80);
  const [minPassGrade, setMinPassGrade] = useState(5);

  useEffect(() => {
    if (!open) return;
    setName(subject?.name ?? '');
    setFullName(subject?.fullName ?? '');
    setProfessor(subject?.professor ?? '');
    setColor(subject?.color ?? SUBJECT_COLORS[0]);
    setGradeModel(subject?.gradeModel ?? 'peso1');
    setTotalHours(subject?.totalHours ?? 80);
    setMinPassGrade(subject?.minPassGrade ?? 5);
  }, [open, subject]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    onSubmit({ name, fullName, professor, color, gradeModel, totalHours, minPassGrade });
    onClose();
  };

  return (
    <BottomSheet open={open} title={subject ? 'Editar matéria' : 'Nova matéria'} onClose={onClose}>
      <form className="grid gap-4" onSubmit={submit}>
        <Input label="Nome curto" required value={name} onChange={(event) => setName(event.target.value)} placeholder="EDL" />
        <Input label="Nome completo" value={fullName} onChange={(event) => setFullName(event.target.value)} placeholder="Estrutura de Dados Linear" />
        <Input label="Professor" value={professor} onChange={(event) => setProfessor(event.target.value)} placeholder="Opcional" />
        <div className="grid gap-2 text-sm text-[var(--text-secondary)]">
          <span>Cor</span>
          <div className="grid grid-cols-10 gap-2">
            {SUBJECT_COLORS.map((option) => (
              <button
                key={option}
                className={`h-8 rounded-full border ${color === option ? 'border-white' : 'border-white/10'}`}
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
          <Input label="Carga horária" type="number" min={1} required value={totalHours} onChange={(event) => setTotalHours(Number(event.target.value))} />
          <Input label="Nota mínima" inputMode="decimal" required value={minPassGrade} onChange={(event) => setMinPassGrade(Number(event.target.value.replace(',', '.')))} />
        </div>
        <Button type="submit" variant="primary">
          Salvar
        </Button>
      </form>
    </BottomSheet>
  );
}
