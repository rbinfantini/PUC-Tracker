import { describe, expect, it } from 'vitest';
import type { Semester } from '../types';
import { generateICS } from '../logic/calendarExport';

const semester: Semester = {
  id: 'semester-1',
  name: '2026.1',
  year: 2026,
  period: 1,
  isActive: true,
  subjects: [
    {
      id: 'subject-1',
      semesterId: 'semester-1',
      name: 'EDL',
      color: '#0A84FF',
      gradeModel: 'peso1',
      totalHours: 80,
      currentAbsences: 0,
      minPassGrade: 5,
      evaluations: [
        {
          id: 'eval-1',
          subjectId: 'subject-1',
          name: 'P1',
          type: 'prova',
          role: 'P1',
          date: '2026-04-10',
          maxGrade: 10,
          grade: null,
          isDelivery: false,
          delivered: false,
          isPS: false
        },
        {
          id: 'eval-2',
          subjectId: 'subject-1',
          name: 'Sem data',
          type: 'atividade',
          role: 'A1',
          maxGrade: 10,
          grade: null,
          isDelivery: false,
          delivered: false,
          isPS: false
        },
        {
          id: 'eval-3',
          subjectId: 'subject-1',
          name: 'Data invalida',
          type: 'atividade',
          role: 'A2',
          date: '10/04/2026',
          maxGrade: 10,
          grade: null,
          isDelivery: false,
          delivered: false,
          isPS: false
        }
      ]
    }
  ]
};

describe('exportacao ICS', () => {
  it('gera calendario valido', () => {
    const ics = generateICS(semester);

    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
  });

  it('inclui avaliacoes com data em evento all-day', () => {
    const ics = generateICS(semester);

    expect(ics).toContain('SUMMARY:EDL — P1');
    expect(ics).toContain('DTSTART;VALUE=DATE:20260410');
  });

  it('ignora avaliacoes sem data ou com data invalida', () => {
    const ics = generateICS(semester);

    expect(ics).not.toContain('Sem data');
    expect(ics).not.toContain('Data invalida');
  });
});
