import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { Semester } from '../../types';
import { calculateSubjectGrade, formatGrade, statusLabel } from '../../logic/grades';
import { Badge } from '../ui/Badge';

interface HistoryScreenProps {
  semesters: Semester[];
}

export function HistoryScreen({ semesters }: HistoryScreenProps) {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  return (
    <div className="grid gap-5">
      <header>
        <p className="text-sm text-[var(--text-secondary)]">Semestres arquivados</p>
        <h1 className="text-3xl font-bold tracking-tight">Histórico</h1>
      </header>
      {semesters.length ? (
        semesters.map((semester) => {
          const open = openIds.includes(semester.id);
          return (
            <section key={semester.id} className="glass rounded-[26px] p-4">
              <button className="flex w-full items-center justify-between gap-3 text-left" type="button" onClick={() => toggle(semester.id)}>
                <div>
                  <h2 className="text-lg font-bold">{semester.name}</h2>
                  <p className="text-sm text-[var(--text-secondary)]">{semester.subjects.length} matérias</p>
                </div>
                <ChevronDown className={open ? 'rotate-180 transition' : 'transition'} size={20} />
              </button>
              {open ? (
                <div className="mt-4 grid gap-3">
                  {semester.subjects.length ? (
                    semester.subjects.map((subject) => {
                      const grade = calculateSubjectGrade(subject);
                      return (
                        <div key={subject.id} className="rounded-[22px] bg-white/[0.06] p-3">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <p className="truncate font-semibold">{subject.name}</p>
                              <p className="text-sm text-[var(--text-secondary)]">MF {formatGrade(grade.average)}</p>
                            </div>
                            <Badge tone={grade.status === 'approved' ? 'green' : grade.status === 'risk' ? 'red' : 'gray'}>{statusLabel(grade.status)}</Badge>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-sm text-[var(--text-secondary)]">Sem matérias registradas.</p>
                  )}
                </div>
              ) : null}
            </section>
          );
        })
      ) : (
        <p className="rounded-[24px] border border-dashed border-white/[0.12] bg-white/[0.035] p-5 text-center text-sm leading-5 text-[var(--text-secondary)]">Nenhum semestre encerrado ainda.</p>
      )}
    </div>
  );
}
