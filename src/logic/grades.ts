import type { Evaluation, GradeResult, GradeModel, Subject, SubjectStatus } from '../types';

type PsTarget = 'P1' | 'P2' | null;

const roundGrade = (value: number) => Math.round(value * 100) / 100;

function visibleNumericEvaluations(evaluations: Evaluation[]): Evaluation[] {
  return evaluations.filter((evaluation) => !evaluation.isDelivery && !evaluation.isPS && evaluation.enabled !== false);
}

function findByRole(evaluations: Evaluation[], role: string): Evaluation | undefined {
  return evaluations.find((evaluation) => evaluation.role.toLowerCase() === role.toLowerCase());
}

function hasGrade(evaluation?: Evaluation): evaluation is Evaluation & { grade: number } {
  return Boolean(evaluation && typeof evaluation.grade === 'number');
}

function statusFromAverage(average: number | null, isPartial: boolean, minPassGrade: number): SubjectStatus {
  if (average === null) return 'no-grades';
  if (!isPartial && average >= minPassGrade) return 'approved';
  if (average < minPassGrade) return 'risk';
  return 'in-progress';
}

function average(values: number[]): number | null {
  if (!values.length) return null;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function applyPeso1Ps(evaluations: Evaluation[], grades: number[]): { values: number[]; appliedPs: PsTarget; message?: string } {
  const ps = evaluations.find((evaluation) => evaluation.isPS);
  const p1 = findByRole(evaluations, 'P1');
  const p2 = findByRole(evaluations, 'P2');

  if (!hasGrade(ps) || !hasGrade(p1) || !hasGrade(p2)) {
    return { values: grades, appliedPs: null };
  }

  const lower = p1.grade <= p2.grade ? p1 : p2;
  if (ps.grade <= lower.grade) {
    return { values: grades, appliedPs: null, message: 'PS nao altera a media neste caso' };
  }

  let replaced = false;
  const values = visibleNumericEvaluations(evaluations).map((evaluation) => {
    if (!replaced && evaluation.id === lower.id) {
      replaced = true;
      return ps.grade;
    }
    return evaluation.grade;
  }).filter((grade): grade is number => typeof grade === 'number');

  return { values, appliedPs: lower.role === 'P2' ? 'P2' : 'P1' };
}

function calculatePeso1(subject: Subject): GradeResult {
  const numeric = visibleNumericEvaluations(subject.evaluations);
  const graded = numeric.filter(hasGrade);
  const missing = numeric.filter((evaluation) => !hasGrade(evaluation)).map((evaluation) => evaluation.name);
  const p1 = findByRole(subject.evaluations, 'P1');
  const p2 = findByRole(subject.evaluations, 'P2');
  const ps = subject.evaluations.find((evaluation) => evaluation.isPS);
  const baseGrades = graded.map((evaluation) => evaluation.grade);
  const psResult = applyPeso1Ps(subject.evaluations, baseGrades);
  const rawAverage = average(psResult.values);
  const finalAverage = rawAverage === null ? null : roundGrade(rawAverage);
  const isPartial = missing.length > 0 || finalAverage === null;
  const shouldShowPs = Boolean(ps?.enabled || hasGrade(ps) || (hasGrade(p1) && hasGrade(p2) && finalAverage !== null && finalAverage < subject.minPassGrade));

  return {
    average: finalAverage,
    finalAverage: isPartial ? null : finalAverage,
    worstCase: finalAverage,
    isPartial,
    status: statusFromAverage(finalAverage, isPartial, subject.minPassGrade),
    missing,
    shouldShowPs,
    appliedPs: psResult.appliedPs,
    psMessage: psResult.message
  };
}

function getModelWeight(model: GradeModel): number {
  return model === 'peso2' ? 2 : 3;
}

function activityAverage(evaluations: Evaluation[], roles: string[]): number | null {
  const grades = roles.map((role) => findByRole(evaluations, role)).filter(hasGrade).map((evaluation) => evaluation.grade);
  return average(grades);
}

function requiredRoles(model: GradeModel): string[] {
  if (model === 'lisbete') return ['P1', 'At1', 'At2', 'P2', 'At3', 'At4'];
  return ['P1', 'A1', 'P2', 'A2'];
}

function collectMissing(evaluations: Evaluation[], roles: string[]): string[] {
  return roles
    .map((role) => findByRole(evaluations, role))
    .filter((evaluation): evaluation is Evaluation => Boolean(evaluation))
    .filter((evaluation) => !hasGrade(evaluation))
    .map((evaluation) => evaluation.name);
}

function buildValues(evaluations: Evaluation[], model: GradeModel, replace: PsTarget, missingAsZero: boolean) {
  const ps = evaluations.find((evaluation) => evaluation.isPS);
  const psGrade = hasGrade(ps) ? ps.grade : null;

  const getGrade = (role: string): number | null => {
    const evaluation = findByRole(evaluations, role);
    if (!evaluation) return missingAsZero ? 0 : null;
    if ((role === replace) && psGrade !== null && hasGrade(evaluation) && psGrade > evaluation.grade) {
      return psGrade;
    }
    if (hasGrade(evaluation)) return evaluation.grade;
    return missingAsZero ? 0 : null;
  };

  const activity = (roles: string[]): number | null => {
    const values = roles.map((role) => getGrade(role)).filter((value): value is number => value !== null);
    if (values.length === 0) return missingAsZero ? 0 : null;
    return average(values);
  };

  const p1 = getGrade('P1');
  const p2 = getGrade('P2');
  const a1 = model === 'lisbete' ? activity(['At1', 'At2']) : getGrade('A1');
  const a2 = model === 'lisbete' ? activity(['At3', 'At4']) : getGrade('A2');

  return { p1, p2, a1, a2 };
}

function calculateWeightedAverage(evaluations: Evaluation[], model: GradeModel, replace: PsTarget, missingAsZero: boolean): number | null {
  const weight = getModelWeight(model);
  const { p1, p2, a1, a2 } = buildValues(evaluations, model, replace, missingAsZero);

  const bimester = (proof: number | null, activity: number | null): number | null => {
    if (proof === null && activity === null) return null;
    if (proof === null) return activity;
    if (activity === null) return proof;
    return (weight * proof + activity) / (weight + 1);
  };

  return average([bimester(p1, a1), bimester(p2, a2)].filter((value): value is number => value !== null));
}

function chooseBestPs(evaluations: Evaluation[], model: GradeModel, missingAsZero: boolean): { average: number | null; appliedPs: PsTarget; message?: string } {
  const ps = evaluations.find((evaluation) => evaluation.isPS);
  const p1 = findByRole(evaluations, 'P1');
  const p2 = findByRole(evaluations, 'P2');
  const noReplace = calculateWeightedAverage(evaluations, model, null, missingAsZero);

  if (!hasGrade(ps) || !hasGrade(p1) || !hasGrade(p2)) {
    return { average: noReplace, appliedPs: null };
  }

  const options: Array<{ target: PsTarget; average: number | null }> = [{ target: null, average: noReplace }];
  if (ps.grade > p1.grade) {
    options.push({ target: 'P1', average: calculateWeightedAverage(evaluations, model, 'P1', missingAsZero) });
  }
  if (ps.grade > p2.grade) {
    options.push({ target: 'P2', average: calculateWeightedAverage(evaluations, model, 'P2', missingAsZero) });
  }

  const best = options.reduce((winner, option) => {
    if (option.average === null) return winner;
    if (winner.average === null || option.average > winner.average) return option;
    return winner;
  });

  return {
    average: best.average,
    appliedPs: best.target,
    message: best.target === null ? 'PS nao altera a media neste caso' : undefined
  };
}

function calculateStructured(subject: Subject): GradeResult {
  const roles = requiredRoles(subject.gradeModel);
  const missing = collectMissing(subject.evaluations, roles);
  const currentPs = chooseBestPs(subject.evaluations, subject.gradeModel, false);
  const worstCasePs = chooseBestPs(subject.evaluations, subject.gradeModel, true);
  const averageValue = currentPs.average === null ? null : roundGrade(currentPs.average);
  const worstCase = worstCasePs.average === null ? null : roundGrade(worstCasePs.average);
  const p1 = findByRole(subject.evaluations, 'P1');
  const p2 = findByRole(subject.evaluations, 'P2');
  const ps = subject.evaluations.find((evaluation) => evaluation.isPS);
  const isPartial = missing.length > 0 || averageValue === null;
  const referenceAverage = worstCase ?? averageValue;
  const shouldShowPs = Boolean(
    ps?.enabled ||
      hasGrade(ps) ||
      (hasGrade(p1) && hasGrade(p2) && referenceAverage !== null && referenceAverage < subject.minPassGrade)
  );

  return {
    average: averageValue,
    finalAverage: isPartial ? null : averageValue,
    worstCase,
    isPartial,
    status: statusFromAverage(averageValue, isPartial, subject.minPassGrade),
    missing,
    shouldShowPs,
    appliedPs: currentPs.appliedPs,
    psMessage: currentPs.message
  };
}

export function calculateSubjectGrade(subject: Subject): GradeResult {
  if (subject.gradeModel === 'peso1') {
    return calculatePeso1(subject);
  }

  return calculateStructured(subject);
}

export function formatGrade(value: number | null): string {
  if (value === null || Number.isNaN(value)) return '--';
  return value.toFixed(2).replace('.', ',');
}

export function parseGradeInput(value: string): number | null {
  const normalized = value.trim().replace(',', '.');
  if (!normalized) return null;
  const parsed = Number(normalized);
  return Number.isFinite(parsed) ? parsed : null;
}

export function isGradeValid(grade: number | null, maxGrade: number): boolean {
  return grade === null || (grade >= 0 && grade <= maxGrade);
}

export function statusLabel(status: SubjectStatus): string {
  const labels: Record<SubjectStatus, string> = {
    approved: 'aprovado',
    'in-progress': 'em andamento',
    risk: 'em risco',
    'no-grades': 'sem notas'
  };

  return labels[status];
}
