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

export function EvaluationForm({ open, evaluation, onClose, onSubmit }: EvaluationFormProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<Evaluation['type']>('prova');
  const [isDelivery, setIsDelivery] = useState(false);
  const [bimester, setBimester] = useState('');
  const [date, setDate] = useState('');
  const [maxGrade, setMaxGrade] = useState(10);

  useEffect(() => {
    if (!open) return;
    setName(evaluation?.name ?? '');
    setType(evaluation?.type ?? 'prova');
    setIsDelivery(evaluation?.isDelivery ?? false);
    setBimester(evaluation?.bimester ? String(evaluation.bimester) : '');
    setDate(evaluation?.date ?? '');
    setMaxGrade(evaluation?.maxGrade ?? 10);
  }, [open, evaluation]);

  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim()) return;
    const payload = {
      name,
      type,
      role: evaluation?.role ?? name,
      isDelivery: type === 'extensionista' ? true : isDelivery,
      bimester: bimester ? (Number(bimester) as 1 | 2) : undefined,
      date: date || undefined,
      maxGrade
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
        <Input label="Nota máxima" type="number" min={1} step="0.1" value={maxGrade} onChange={(event) => setMaxGrade(Number(event.target.value))} />
        <Button type="submit" variant="primary">
          Salvar avaliação
        </Button>
      </form>
    </BottomSheet>
  );
}
