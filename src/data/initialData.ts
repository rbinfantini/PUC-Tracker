import { v4 as uuid } from 'uuid';
import type { AppData, Evaluation, GradeModel, Semester } from '../types';

export const SUBJECT_COLORS = [
  '#0A84FF',
  '#30D158',
  '#FFD60A',
  '#FF453A',
  '#BF5AF2',
  '#64D2FF',
  '#FF9F0A',
  '#AC8E68',
  '#5E5CE6',
  '#FF375F'
];

export function getCurrentPeriod(date = new Date()): 1 | 2 {
  return date.getMonth() < 6 ? 1 : 2;
}

export function createEmptySemester(date = new Date()): Semester {
  const year = date.getFullYear();
  const period = getCurrentPeriod(date);

  return {
    id: uuid(),
    name: `${year}.${period}`,
    year,
    period,
    isActive: true,
    subjects: []
  };
}

export function createInitialData(date = new Date()): AppData {
  const semester = createEmptySemester(date);

  return {
    version: 1,
    semesters: [semester],
    activeSemesterId: semester.id
  };
}

function baseEvaluation(subjectId: string, name: string, role: string, bimester?: 1 | 2): Evaluation {
  return {
    id: uuid(),
    subjectId,
    name,
    type: role === 'PS' || role.startsWith('P') ? 'prova' : 'atividade',
    role,
    bimester,
    maxGrade: 10,
    grade: null,
    isDelivery: false,
    delivered: false,
    isPS: role === 'PS',
    enabled: role === 'PS' ? false : true
  };
}

export function createDefaultEvaluations(subjectId: string, model: GradeModel): Evaluation[] {
  if (model === 'peso1') {
    return [];
  }

  if (model === 'lisbete') {
    return [
      baseEvaluation(subjectId, 'P1', 'P1', 1),
      baseEvaluation(subjectId, 'At1', 'At1', 1),
      baseEvaluation(subjectId, 'At2', 'At2', 1),
      baseEvaluation(subjectId, 'P2', 'P2', 2),
      baseEvaluation(subjectId, 'At3', 'At3', 2),
      baseEvaluation(subjectId, 'At4', 'At4', 2),
      baseEvaluation(subjectId, 'PS', 'PS')
    ];
  }

  return [
    baseEvaluation(subjectId, 'P1', 'P1', 1),
    baseEvaluation(subjectId, 'A1', 'A1', 1),
    baseEvaluation(subjectId, 'P2', 'P2', 2),
    baseEvaluation(subjectId, 'A2', 'A2', 2),
    baseEvaluation(subjectId, 'PS', 'PS')
  ];
}
