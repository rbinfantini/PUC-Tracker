import { ChangeEvent, useRef, useState } from 'react';
import { Download, FileUp, RotateCcw } from 'lucide-react';
import type { AppData, Semester } from '../../types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';

interface SettingsScreenProps {
  data: AppData;
  semester: Semester;
  onRenameSemester: (name: string) => void;
  onEndSemester: () => void;
  onImportData: (value: unknown) => void;
}

function todayName() {
  return new Date().toISOString().slice(0, 10);
}

function downloadJson(data: AppData) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `backup_puc_tracker_${todayName()}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export function SettingsScreen({ data, semester, onRenameSemester, onEndSemester, onImportData }: SettingsScreenProps) {
  const [name, setName] = useState(semester.name);
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const importFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const confirmed = window.confirm('Importar este backup vai sobrescrever os dados atuais. Continuar?');
      if (!confirmed) return;
      onImportData(parsed);
      setMessage('Backup importado com sucesso.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Nao foi possivel importar o arquivo.');
    } finally {
      event.target.value = '';
    }
  };

  return (
    <div className="grid gap-5">
      <header>
        <p className="text-sm text-[var(--text-secondary)]">PUC Tracker</p>
        <h1 className="text-3xl font-bold">Configurações</h1>
      </header>

      <Card className="grid gap-4">
        <h2 className="text-lg font-bold">Semestre atual</h2>
        <Input label="Nome" value={name} onChange={(event) => setName(event.target.value)} />
        <div className="grid grid-cols-2 gap-3">
          <Button type="button" variant="primary" onClick={() => onRenameSemester(name)}>
            Renomear
          </Button>
          <Button icon={<RotateCcw size={16} />} type="button" onClick={onEndSemester}>
            Encerrar semestre
          </Button>
        </div>
      </Card>

      <Card className="grid gap-4">
        <h2 className="text-lg font-bold">Backup</h2>
        <Button icon={<Download size={16} />} type="button" variant="primary" onClick={() => downloadJson(data)}>
          Exportar JSON
        </Button>
        <input ref={inputRef} className="hidden" type="file" accept="application/json" onChange={importFile} />
        <Button icon={<FileUp size={16} />} type="button" onClick={() => inputRef.current?.click()}>
          Importar JSON
        </Button>
        {message ? <p className="text-sm text-[var(--text-secondary)]">{message}</p> : null}
      </Card>

      <Card>
        <h2 className="text-lg font-bold">Sobre</h2>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">PUC Tracker · Versão 1.0.0</p>
        <p className="mt-2 text-sm text-[var(--text-secondary)]">App pessoal para acompanhamento de notas e faltas.</p>
      </Card>
    </div>
  );
}
