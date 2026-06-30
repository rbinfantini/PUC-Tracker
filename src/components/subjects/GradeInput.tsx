import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { isGradeValid, parseGradeInput } from '../../logic/grades';
import { Button } from '../ui/Button';

interface GradeInputProps {
  value: number | null;
  maxGrade: number;
  disabled?: boolean;
  onSave: (grade: number | null) => void;
}

export function GradeInput({ value, maxGrade, disabled, onSave }: GradeInputProps) {
  const [draft, setDraft] = useState(value === null ? '' : String(value).replace('.', ','));
  const parsed = parseGradeInput(draft);
  const valid = isGradeValid(parsed, maxGrade);

  useEffect(() => {
    setDraft(value === null ? '' : String(value).replace('.', ','));
  }, [value]);

  return (
    <div className="flex items-center gap-2">
      <input
        className={`h-10 w-20 rounded-2xl border bg-white/[0.06] px-3 text-center text-sm outline-none ${
          valid ? 'border-white/10 focus:border-[var(--accent)]' : 'border-[var(--red)]'
        }`}
        inputMode="decimal"
        placeholder="--"
        value={draft}
        disabled={disabled}
        onChange={(event) => setDraft(event.target.value)}
      />
      <Button
        className="h-10 min-h-10 px-3"
        disabled={disabled || !valid}
        icon={<Check size={16} />}
        type="button"
        variant="secondary"
        onClick={() => onSave(parsed)}
      >
        OK
      </Button>
    </div>
  );
}
