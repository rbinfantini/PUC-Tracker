import { useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import type { AppData, Evaluation, GradeModel, Subject } from '../types';
import { createDefaultEvaluations, createEmptySemester, SUBJECT_COLORS } from '../data/initialData';
import { loadAppData, saveAppData, validateImportedData } from '../data/storage';

export interface SubjectInput {
  name: string;
  fullName?: string;
  professor?: string;
  color: string;
  gradeModel: GradeModel;
  totalHours: number;
  minPassGrade: number;
}

export interface EvaluationInput {
  name: string;
  type: Evaluation['type'];
  role?: string;
  bimester?: 1 | 2;
  date?: string;
  maxGrade: number;
  isDelivery: boolean;
}

function mapSubject(data: AppData, subjectId: string, mapper: (subject: Subject) => Subject): AppData {
  return {
    ...data,
    semesters: data.semesters.map((semester) => ({
      ...semester,
      subjects: semester.subjects.map((subject) => (subject.id === subjectId ? mapper(subject) : subject))
    }))
  };
}

export function useAppData() {
  const [data, setData] = useState<AppData>(() => loadAppData());

  useEffect(() => {
    saveAppData(data);
  }, [data]);

  const activeSemester = useMemo(
    () => data.semesters.find((semester) => semester.id === data.activeSemesterId) ?? data.semesters[0],
    [data]
  );

  const archivedSemesters = useMemo(() => data.semesters.filter((semester) => !semester.isActive), [data]);

  const addSubject = (input: SubjectInput) => {
    const subjectId = uuid();
    const activeId = data.activeSemesterId;
    const subject: Subject = {
      id: subjectId,
      semesterId: activeId,
      name: input.name.trim(),
      fullName: input.fullName?.trim() || undefined,
      professor: input.professor?.trim() || undefined,
      color: input.color || SUBJECT_COLORS[0],
      gradeModel: input.gradeModel,
      totalHours: input.totalHours,
      currentAbsences: 0,
      minPassGrade: input.minPassGrade,
      evaluations: createDefaultEvaluations(subjectId, input.gradeModel)
    };

    setData((current) => ({
      ...current,
      semesters: current.semesters.map((semester) =>
        semester.id === activeId ? { ...semester, subjects: [...semester.subjects, subject] } : semester
      )
    }));

    return subjectId;
  };

  const updateSubject = (subjectId: string, input: SubjectInput) => {
    setData((current) =>
      mapSubject(current, subjectId, (subject) => {
        const gradeModelChanged = subject.gradeModel !== input.gradeModel;
        return {
          ...subject,
          name: input.name.trim(),
          fullName: input.fullName?.trim() || undefined,
          professor: input.professor?.trim() || undefined,
          color: input.color,
          gradeModel: input.gradeModel,
          totalHours: input.totalHours,
          minPassGrade: input.minPassGrade,
          evaluations: gradeModelChanged ? createDefaultEvaluations(subject.id, input.gradeModel) : subject.evaluations
        };
      })
    );
  };

  const deleteSubject = (subjectId: string) => {
    setData((current) => ({
      ...current,
      semesters: current.semesters.map((semester) => ({
        ...semester,
        subjects: semester.subjects.filter((subject) => subject.id !== subjectId)
      }))
    }));
  };

  const updateAbsences = (subjectId: string, delta: number) => {
    setData((current) =>
      mapSubject(current, subjectId, (subject) => ({
        ...subject,
        currentAbsences: Math.max(0, subject.currentAbsences + delta)
      }))
    );
  };

  const addEvaluation = (subjectId: string, input: EvaluationInput) => {
    const evaluation: Evaluation = {
      id: uuid(),
      subjectId,
      name: input.name.trim(),
      type: input.type,
      role: input.role?.trim() || input.name.trim(),
      bimester: input.bimester,
      date: input.date || undefined,
      maxGrade: input.maxGrade,
      grade: null,
      isDelivery: input.type === 'extensionista' ? true : input.isDelivery,
      delivered: false,
      isPS: false,
      enabled: true
    };

    setData((current) =>
      mapSubject(current, subjectId, (subject) => ({
        ...subject,
        evaluations: [...subject.evaluations, evaluation]
      }))
    );
  };

  const updateEvaluation = (subjectId: string, evaluationId: string, patch: Partial<Evaluation>) => {
    setData((current) =>
      mapSubject(current, subjectId, (subject) => ({
        ...subject,
        evaluations: subject.evaluations.map((evaluation) =>
          evaluation.id === evaluationId
            ? {
                ...evaluation,
                ...patch,
                grade: patch.isDelivery || patch.type === 'extensionista' ? null : patch.grade ?? evaluation.grade,
                isDelivery: patch.type === 'extensionista' ? true : patch.isDelivery ?? evaluation.isDelivery
              }
            : evaluation
        )
      }))
    );
  };

  const deleteEvaluation = (subjectId: string, evaluationId: string) => {
    setData((current) =>
      mapSubject(current, subjectId, (subject) => ({
        ...subject,
        evaluations: subject.evaluations.filter((evaluation) => evaluation.id !== evaluationId)
      }))
    );
  };

  const markPS = (subjectId: string) => {
    setData((current) =>
      mapSubject(current, subjectId, (subject) => ({
        ...subject,
        evaluations: subject.evaluations.map((evaluation) =>
          evaluation.isPS ? { ...evaluation, enabled: true } : evaluation
        )
      }))
    );
  };

  const renameActiveSemester = (name: string) => {
    setData((current) => ({
      ...current,
      semesters: current.semesters.map((semester) =>
        semester.id === current.activeSemesterId ? { ...semester, name: name.trim() || semester.name } : semester
      )
    }));
  };

  const endSemester = () => {
    const next = createEmptySemester();
    setData((current) => ({
      version: 1,
      activeSemesterId: next.id,
      semesters: [
        ...current.semesters.map((semester) =>
          semester.id === current.activeSemesterId ? { ...semester, isActive: false } : semester
        ),
        next
      ]
    }));
  };

  const importData = (value: unknown) => {
    setData(validateImportedData(value));
  };

  return {
    data,
    activeSemester,
    archivedSemesters,
    addSubject,
    updateSubject,
    deleteSubject,
    updateAbsences,
    addEvaluation,
    updateEvaluation,
    deleteEvaluation,
    markPS,
    renameActiveSemester,
    endSemester,
    importData
  };
}
