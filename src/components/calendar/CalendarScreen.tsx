import { useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import type { CalendarEvent, Semester } from '../../types';
import { generateICS, getSemesterEvents } from '../../logic/calendarExport';
import { formatGrade } from '../../logic/grades';
import { formatShortDate } from '../../logic/dates';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { CalendarMonthGrid } from './CalendarMonthGrid';
import { AgendaList } from './AgendaList';

interface CalendarScreenProps {
  semester: Semester;
}

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function CalendarScreen({ semester }: CalendarScreenProps) {
  const [month, setMonth] = useState(new Date());
  const [selected, setSelected] = useState<CalendarEvent | null>(null);
  const events = useMemo(() => getSemesterEvents(semester), [semester]);

  return (
    <div className="grid gap-5">
      <header>
        <p className="text-sm text-[var(--text-secondary)]">{semester.name}</p>
        <h1 className="text-3xl font-bold tracking-tight">Calendário</h1>
      </header>
      <CalendarMonthGrid month={month} events={events} onMonthChange={setMonth} onSelect={setSelected} />
      <Button icon={<Download size={16} />} type="button" variant="primary" onClick={() => downloadFile(`puc_tracker_${semester.name}.ics`, generateICS(semester), 'text/calendar')}>
        Exportar calendário
      </Button>
      <AgendaList events={events} onSelect={setSelected} />
      <Modal open={Boolean(selected)} title="Avaliação" onClose={() => setSelected(null)}>
        {selected ? (
          <div className="grid gap-3">
            <p className="text-sm text-[var(--text-secondary)]">{selected.subjectName}</p>
            <h3 className="text-2xl font-bold tracking-tight">{selected.evaluation.name}</h3>
            <div className="grid gap-2 rounded-[22px] bg-white/[0.055] p-4 text-sm">
              <p>Tipo: {selected.evaluation.type}</p>
              <p>Data: {formatShortDate(selected.evaluation.date)}</p>
              <p>Nota: {formatGrade(selected.evaluation.grade)}</p>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
