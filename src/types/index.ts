export type GradeModel = 'peso1' | 'peso2' | 'peso3' | 'lisbete';
export type EvaluationType = 'prova' | 'atividade' | 'extensionista';
export type TabKey = 'home' | 'calendar' | 'history' | 'settings';
export type SubjectStatus = 'approved' | 'in-progress' | 'risk' | 'no-grades';

export interface AppData {
  version: 1;
  semesters: Semester[];
  activeSemesterId: string;
}

export interface Semester {
  id: string;
  name: string;
  year: number;
  period: 1 | 2;
  isActive: boolean;
  subjects: Subject[];
}

export interface Subject {
  id: string;
  semesterId: string;
  name: string;
  fullName?: string;
  professor?: string;
  color: string;
  gradeModel: GradeModel;
  totalHours: number;
  currentAbsences: number;
  minPassGrade: number;
  evaluations: Evaluation[];
}

export interface Evaluation {
  id: string;
  subjectId: string;
  name: string;
  type: EvaluationType;
  role: string;
  bimester?: 1 | 2;
  date?: string;
  maxGrade: number;
  grade: number | null;
  isDelivery: boolean;
  delivered: boolean;
  isPS: boolean;
  enabled?: boolean;
}

export interface GradeResult {
  average: number | null;
  finalAverage: number | null;
  worstCase: number | null;
  isPartial: boolean;
  status: SubjectStatus;
  missing: string[];
  shouldShowPs: boolean;
  appliedPs: 'P1' | 'P2' | null;
  psMessage?: string;
}

export interface AbsenceResult {
  maxAbsences: number;
  remaining: number;
  status: 'ok' | 'warning' | 'danger';
  ratioUsed: number;
}

export interface CalendarEvent {
  id: string;
  subjectId: string;
  subjectName: string;
  subjectColor: string;
  evaluation: Evaluation;
}
