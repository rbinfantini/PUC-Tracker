import { describe, expect, it } from 'vitest';
import { calculateAbsences, getMaxAbsences } from '../logic/absences';

describe('faltas', () => {
  it('calcula maxAbsences como floor(totalHours * 0.25)', () => {
    expect(getMaxAbsences(81)).toBe(20);
  });

  it('marca amarelo perto do limite', () => {
    const result = calculateAbsences(80, 14);

    expect(result.maxAbsences).toBe(20);
    expect(result.status).toBe('warning');
  });

  it('marca vermelho acima do limite', () => {
    const result = calculateAbsences(80, 21);

    expect(result.status).toBe('danger');
  });
});
