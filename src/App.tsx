import { useMemo, useState } from 'react';
import { Plus } from 'lucide-react';
import type { Evaluation, Subject, TabKey } from './types';
import type { EvaluationInput, SubjectInput } from './hooks/useAppData';
import { useAppData } from './hooks/useAppData';
import { AppShell } from './components/layout/AppShell';
import { SubjectCard } from './components/subjects/SubjectCard';
import { SubjectDetail } from './components/subjects/SubjectDetail';
import { SubjectForm } from './components/subjects/SubjectForm';
import { CalendarScreen } from './components/calendar/CalendarScreen';
import { HistoryScreen } from './components/history/HistoryScreen';
import { SettingsScreen } from './components/settings/SettingsScreen';

function EmptyHome() {
  return (
    <div className="rounded-[26px] border border-dashed border-white/[0.12] bg-white/[0.035] p-6 text-center">
      <p className="text-lg font-semibold">Sem matérias ainda</p>
      <p className="mt-2 text-sm leading-5 text-[var(--text-secondary)]">Cadastre a primeira matéria para acompanhar notas, faltas e avaliações.</p>
    </div>
  );
}

export default function App() {
  const app = useAppData();
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [subjectFormOpen, setSubjectFormOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);

  const selectedSubject = useMemo(() => {
    const allSubjects = app.data.semesters.flatMap((semester) => semester.subjects);
    return allSubjects.find((subject) => subject.id === selectedSubjectId) ?? null;
  }, [app.data.semesters, selectedSubjectId]);

  const selectedSemester = useMemo(
    () => app.data.semesters.find((semester) => semester.subjects.some((subject) => subject.id === selectedSubjectId)),
    [app.data.semesters, selectedSubjectId]
  );
  const selectedReadOnly = Boolean(selectedSemester && !selectedSemester.isActive);

  const openSubjectForm = (subject?: Subject) => {
    setEditingSubject(subject ?? null);
    setSubjectFormOpen(true);
  };

  const submitSubject = (input: SubjectInput) => {
    if (editingSubject) {
      app.updateSubject(editingSubject.id, input);
    } else {
      const id = app.addSubject(input);
      setSelectedSubjectId(id);
    }
  };

  const deleteSelectedSubject = () => {
    if (!selectedSubject) return;
    const confirmed = window.confirm(`Excluir ${selectedSubject.name}?`);
    if (!confirmed) return;
    app.deleteSubject(selectedSubject.id);
    setSelectedSubjectId(null);
  };

  const updateEvaluation = (evaluationId: string, patch: Partial<Evaluation>) => {
    if (!selectedSubject) return;
    app.updateEvaluation(selectedSubject.id, evaluationId, patch);
  };

  const addEvaluation = (input: EvaluationInput) => {
    if (!selectedSubject) return;
    app.addEvaluation(selectedSubject.id, input);
  };

  let content = null;
  if (selectedSubject) {
    content = (
      <SubjectDetail
        subject={selectedSubject}
        readOnly={selectedReadOnly}
        onBack={() => setSelectedSubjectId(null)}
        onEditSubject={() => openSubjectForm(selectedSubject)}
        onDeleteSubject={deleteSelectedSubject}
        onAbsenceChange={(delta) => app.updateAbsences(selectedSubject.id, delta)}
        onAddEvaluation={addEvaluation}
        onUpdateEvaluation={updateEvaluation}
        onDeleteEvaluation={(evaluationId) => app.deleteEvaluation(selectedSubject.id, evaluationId)}
        onMarkPS={() => app.markPS(selectedSubject.id)}
      />
    );
  } else if (activeTab === 'home') {
    content = (
      <div className="grid gap-5">
        <header>
          <p className="text-sm text-[var(--text-secondary)]">{app.activeSemester.name}</p>
          <h1 className="text-3xl font-bold tracking-tight">Início</h1>
        </header>
        {app.activeSemester.subjects.length ? (
          <div className="grid gap-4">
            {app.activeSemester.subjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} onOpen={() => setSelectedSubjectId(subject.id)} />
            ))}
          </div>
        ) : (
          <EmptyHome />
        )}
        <button
          className="fixed bottom-28 right-[calc(50%-200px)] z-30 grid h-14 w-14 place-items-center rounded-full bg-[var(--accent)] text-white shadow-2xl shadow-blue-950/40 transition active:scale-95 max-[430px]:right-5"
          type="button"
          onClick={() => openSubjectForm()}
          aria-label="Adicionar matéria"
        >
          <Plus size={26} />
        </button>
      </div>
    );
  } else if (activeTab === 'calendar') {
    content = <CalendarScreen semester={app.activeSemester} />;
  } else if (activeTab === 'history') {
    content = <HistoryScreen semesters={app.archivedSemesters} />;
  } else {
    content = (
      <SettingsScreen
        data={app.data}
        semester={app.activeSemester}
        onRenameSemester={app.renameActiveSemester}
        onEndSemester={() => {
          const confirmed = window.confirm('Encerrar o semestre atual e criar um novo vazio?');
          if (confirmed) app.endSemester();
        }}
        onImportData={app.importData}
      />
    );
  }

  return (
    <AppShell
      activeTab={activeTab}
      onTabChange={(tab) => {
        setSelectedSubjectId(null);
        setActiveTab(tab);
      }}
    >
      {content}
      <SubjectForm
        open={subjectFormOpen}
        subject={editingSubject}
        onClose={() => {
          setSubjectFormOpen(false);
          setEditingSubject(null);
        }}
        onSubmit={submitSubject}
      />
    </AppShell>
  );
}
