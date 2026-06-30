import { describe, expect, it } from 'vitest';
import type { Evaluation, GradeModel, Subject } from '../types';
import { calculateSubjectGrade } from '../logic/grades';

function evaluation(overrides: Partial<Evaluation>): Evaluation {
  return {
    id: overrides.id ?? overrides.role ?? 'eval',
    subjectId: 'subject-1',
    name: overrides.name ?? overrides.role ?? 'Avaliação',
    type: overrides.type ?? 'prova',
    role: overrides.role ?? 'P1',
    maxGrade: overrides.maxGrade ?? 10,
    grade: overrides.grade ?? null,
    isDelivery: overrides.isDelivery ?? false,
    delivered: overrides.delivered ?? false,
    isPS: overrides.isPS ?? false,
    enabled: overrides.enabled ?? true,
    bimester: overrides.bimester,
    date: overrides.date
  };
}

function subject(model: GradeModel, evaluations: Evaluation[]): Subject {
  return {
    id: 'subject-1',
    semesterId: 'semester-1',
    name: 'EDL',
    color: '#0A84FF',
    gradeModel: model,
    totalHours: 80,
    currentAbsences: 0,
    minPassGrade: 5,
    evaluations
  };
}

describe('Peso 1', () => {
  it('calcula media com avaliacoes lancadas', () => {
    const result = calculateSubjectGrade(subject('peso1', [
      evaluation({ role: 'T1', name: 'T1', grade: 8 }),
      evaluation({ role: 'T2', name: 'T2', grade: 6 })
    ]));

    expect(result.average).toBe(7);
    expect(result.isPartial).toBe(false);
  });

  it('ignora avaliacoes sem nota', () => {
    const result = calculateSubjectGrade(subject('peso1', [
      evaluation({ role: 'T1', grade: 8 }),
      evaluation({ role: 'T2', grade: null })
    ]));

    expect(result.average).toBe(8);
    expect(result.isPartial).toBe(true);
  });

  it('ignora entregas', () => {
    const result = calculateSubjectGrade(subject('peso1', [
      evaluation({ role: 'T1', grade: 8 }),
      evaluation({ role: 'EXT', grade: null, isDelivery: true, delivered: true, type: 'extensionista' })
    ]));

    expect(result.average).toBe(8);
  });

  it('nao aprova definitivamente quando a media ainda e parcial', () => {
    const result = calculateSubjectGrade(subject('peso1', [
      evaluation({ role: 'T1', grade: 10 }),
      evaluation({ role: 'T2', grade: null })
    ]));

    expect(result.average).toBe(10);
    expect(result.finalAverage).toBeNull();
    expect(result.isPartial).toBe(true);
    expect(result.status).not.toBe('approved');
  });
});

describe('Peso 2', () => {
  it('calcula media completa', () => {
    const result = calculateSubjectGrade(subject('peso2', [
      evaluation({ role: 'P1', grade: 6 }),
      evaluation({ role: 'A1', type: 'atividade', grade: 9 }),
      evaluation({ role: 'P2', grade: 8 }),
      evaluation({ role: 'A2', type: 'atividade', grade: 7 }),
      evaluation({ role: 'PS', isPS: true, enabled: false, grade: null })
    ]));

    expect(result.average).toBe(7.33);
    expect(result.isPartial).toBe(false);
  });

  it('substitui P1 quando a PS melhora a maior MF', () => {
    const result = calculateSubjectGrade(subject('peso2', [
      evaluation({ role: 'P1', grade: 3 }),
      evaluation({ role: 'A1', type: 'atividade', grade: 6 }),
      evaluation({ role: 'P2', grade: 7 }),
      evaluation({ role: 'A2', type: 'atividade', grade: 6 }),
      evaluation({ role: 'PS', isPS: true, enabled: true, grade: 8 })
    ]));

    expect(result.appliedPs).toBe('P1');
    expect(result.average).toBe(7);
  });

  it('substitui P2 quando essa troca gera a maior MF', () => {
    const result = calculateSubjectGrade(subject('peso2', [
      evaluation({ role: 'P1', grade: 7 }),
      evaluation({ role: 'A1', type: 'atividade', grade: 6 }),
      evaluation({ role: 'P2', grade: 3 }),
      evaluation({ role: 'A2', type: 'atividade', grade: 6 }),
      evaluation({ role: 'PS', isPS: true, enabled: true, grade: 8 })
    ]));

    expect(result.appliedPs).toBe('P2');
    expect(result.average).toBe(7);
  });

  it('nao substitui se a PS for menor', () => {
    const result = calculateSubjectGrade(subject('peso2', [
      evaluation({ role: 'P1', grade: 7 }),
      evaluation({ role: 'A1', type: 'atividade', grade: 8 }),
      evaluation({ role: 'P2', grade: 6 }),
      evaluation({ role: 'A2', type: 'atividade', grade: 8 }),
      evaluation({ role: 'PS', isPS: true, enabled: true, grade: 5 })
    ]));

    expect(result.appliedPs).toBeNull();
    expect(result.average).toBe(7);
    expect(result.psMessage).toBe('PS nao altera a media neste caso');
  });

  it('nao mostra PS automaticamente enquanto a media estruturada ainda e parcial', () => {
    const result = calculateSubjectGrade(subject('peso2', [
      evaluation({ role: 'P1', grade: 2 }),
      evaluation({ role: 'A1', type: 'atividade', grade: null }),
      evaluation({ role: 'P2', grade: 2 }),
      evaluation({ role: 'A2', type: 'atividade', grade: null }),
      evaluation({ role: 'PS', isPS: true, enabled: false, grade: null })
    ]));

    expect(result.isPartial).toBe(true);
    expect(result.shouldShowPs).toBe(false);
  });

  it('mostra PS automaticamente quando a media final fica abaixo do minimo', () => {
    const result = calculateSubjectGrade(subject('peso2', [
      evaluation({ role: 'P1', grade: 2 }),
      evaluation({ role: 'A1', type: 'atividade', grade: 4 }),
      evaluation({ role: 'P2', grade: 3 }),
      evaluation({ role: 'A2', type: 'atividade', grade: 4 }),
      evaluation({ role: 'PS', isPS: true, enabled: false, grade: null })
    ]));

    expect(result.isPartial).toBe(false);
    expect(result.average).toBeLessThan(5);
    expect(result.shouldShowPs).toBe(true);
  });
});

describe('Peso 3', () => {
  it('calcula media completa', () => {
    const result = calculateSubjectGrade(subject('peso3', [
      evaluation({ role: 'P1', grade: 6 }),
      evaluation({ role: 'A1', type: 'atividade', grade: 10 }),
      evaluation({ role: 'P2', grade: 8 }),
      evaluation({ role: 'A2', type: 'atividade', grade: 4 }),
      evaluation({ role: 'PS', isPS: true, enabled: false })
    ]));

    expect(result.average).toBe(7);
  });

  it('aplica PS quando melhora a prova', () => {
    const result = calculateSubjectGrade(subject('peso3', [
      evaluation({ role: 'P1', grade: 2 }),
      evaluation({ role: 'A1', type: 'atividade', grade: 8 }),
      evaluation({ role: 'P2', grade: 6 }),
      evaluation({ role: 'A2', type: 'atividade', grade: 6 }),
      evaluation({ role: 'PS', isPS: true, enabled: true, grade: 7 })
    ]));

    expect(result.appliedPs).toBe('P1');
    expect(result.average).toBe(6.63);
  });
});

describe('Lisbete', () => {
  it('calcula A1, A2 e MF', () => {
    const result = calculateSubjectGrade(subject('lisbete', [
      evaluation({ role: 'P1', grade: 6 }),
      evaluation({ role: 'At1', type: 'atividade', grade: 8 }),
      evaluation({ role: 'At2', type: 'atividade', grade: 10 }),
      evaluation({ role: 'P2', grade: 7 }),
      evaluation({ role: 'At3', type: 'atividade', grade: 5 }),
      evaluation({ role: 'At4', type: 'atividade', grade: 7 }),
      evaluation({ role: 'PS', isPS: true, enabled: false })
    ]));

    expect(result.average).toBe(6.75);
  });

  it('aplica PS no melhor cenario', () => {
    const result = calculateSubjectGrade(subject('lisbete', [
      evaluation({ role: 'P1', grade: 4 }),
      evaluation({ role: 'At1', type: 'atividade', grade: 5 }),
      evaluation({ role: 'At2', type: 'atividade', grade: 5 }),
      evaluation({ role: 'P2', grade: 7 }),
      evaluation({ role: 'At3', type: 'atividade', grade: 8 }),
      evaluation({ role: 'At4', type: 'atividade', grade: 8 }),
      evaluation({ role: 'PS', isPS: true, enabled: true, grade: 8 })
    ]));

    expect(result.appliedPs).toBe('P1');
    expect(result.average).toBe(7.25);
  });
});
