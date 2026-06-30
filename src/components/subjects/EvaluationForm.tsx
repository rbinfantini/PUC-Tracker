import { FormEvent, useEffect, useState } from 'react';
import type { Evaluation } from '../../types';
import type { EvaluationInput } from '../../hooks/useAppData';
import { BottomSheet } from '../ui/BottomSheet';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';

interface EvaluationFormProps {
  open: boolean;
  evaluation?: Evaluation | null;
  onClose: () => void;
  onSubmit: (input: EvaluationInput | Partial<Evaluation>) => void;
}

function parsePositiveNumber(value: string): number | null {
  const parsed = Number(value.trim().replace(',', '.'));
  return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
}

export function EvaluationForm({ open, evaluation, onClose, onSubmit }: EvaluationFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Evaluation['type']>('prova');
  const [isDelivery, setIsDelivery] = useState(false);
  const [bimester, setBimester] = useState('');
  const [date, setDate] = useState('');
  const [maxGrade, setMaxGrade] = useState('10');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) return;
    setName(evaluation?.name ?? '');
    setType(evaluation?.type ?? 'prova');
    setIsDelivery(evaluation?.isDelivery ?? false);
    setBimester(evaluation?.bimester ? String(evaluation.bimester) : '');
    setDate(evaluation?.date ?? '');
    setMaxGrade(String(evaluation?.maxGrade ?? 10).replace('.', ','));
    setError('');
  }, [open, evaluation]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const parsedMaxGrade = parsePositiveNumber(maxGrade);

    if (!name.trim()) {
      setError('Informe o nome da avaliação.');
      return;
    }
    if (!parsedMaxGrade) {
      setError('Informe uma nota máxima maior que zero.');
      return;
    }

    const deliveryOnly = type === 'extensionista' ? true : isDelivery;
    const payload = {
      name,
      type,
      role: evaluation?.role ?? name,
      isDelivery: deliveryOnly,
      grade: deliveryOnly ? null : evaluation?.grade,
      bimester: bimester ? (Number(bimester) as 1 | 2) : undefined,
      date: date || undefined,
      maxGrade: parsedMaxGrade
    };
    onSubmit(payload);
    onClose();
  };

  return (
    <BottomSheet open={open} title={evaluation ? 'Editar avaliação' : 'Nova avaliação'} onClose={onClose}>
      <form className="grid gap-4" onSubmit={submit}>
        <Input label="Nome" required value={name} onChange={(event) => setName(event.target.value)} placeholder="P1, Atividade, Entrega..." />
        <Select label="Tipo" value={type} onChange={(event) => setType(event.target.value as Evaluation['type'])}>
          <option value="prova">Prova</option>
          <option value="atividade">Atividade</option>
          <option value="extensionista">Extensionista</option>
        </Select>
        <label className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.06] p-3 text-sm">
          <span>É só entrega?</span>
          <input type="checkbox" checked={type === 'extensionista' || isDelivery} disabled={type === 'extensionista'} onChange={(event) => setIsDelivery(event.target.checked)} />
        </label>
        <Select label="Bimestre" value={bimester} onChange={(event) => setBimester(event.target.value)}>
          <option value="">Sem bimestre</option>
          <option value="1">1º bimestre</option>
          <option value="2">2º bimestre</option>
        </Select>
        <Input label="Data" type="date" value={date} onChange={(event) => setDate(event.target.value)} />
        <Input label="Nota máxima" inputMode="decimal" value={maxGrade} onChange={(event) => setMaxGrade(event.target.value)} />
        {error ? <p className="rounded-2xl bg-[var(--red)]/10 px-3 py-2 text-sm text-[var(--red)]">{error}</p> : null}
        <Button type="submit" variant="primary">
          Salvar avaliação
        </Button>
      </form>
    </BottomSheet>
  );
}
