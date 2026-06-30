import type { AbsenceResult } from '../types';

export function getMaxAbsences(totalHours: number): number {
  return Math.floor(Math.max(0, totalHours) * 0.25);
}

export function calculateAbsences(totalHours: number, currentAbsences: number): AbsenceResult {
  const maxAbsences = getMaxAbsences(totalHours);
  const normalizedCurrent = Math.max(0, currentAbsences);
  const remaining = maxAbsences - normalizedCurrent;
  const ratioUsed = maxAbsences === 0 ? 0 : Math.min(1, normalizedCurrent / maxAbsences);

  let status: AbsenceResult['status'] = 'ok';
  if (normalizedCurrent > maxAbsences) {
    status = 'danger';
  } else if (maxAbsences > 0 && remaining / maxAbsences <= 0.3) {
    status = 'warning';
  }

  return {
    maxAbsences,
    remaining,
    status,
    ratioUsed
  };
}
