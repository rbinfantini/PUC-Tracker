import type { AppData } from '../types';
import { createInitialData } from './initialData';

export const STORAGE_KEY = 'puc-tracker-data';

function isAppData(value: unknown): value is AppData {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<AppData>;
  return data.version === 1 && Array.isArray(data.semesters) && typeof data.activeSemesterId === 'string';
}

export function loadAppData(): AppData {
  if (typeof window === 'undefined') {
    return createInitialData();
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initial = createInitialData();
    saveAppData(initial);
    return initial;
  }

  try {
    const parsed = JSON.parse(raw);
    if (isAppData(parsed)) {
      return parsed;
    }
  } catch {
    // Invalid user data falls back to a clean local structure.
  }

  const initial = createInitialData();
  saveAppData(initial);
  return initial;
}

export function saveAppData(data: AppData): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function validateImportedData(value: unknown): AppData {
  if (!isAppData(value)) {
    throw new Error('Arquivo invalido ou versao incompativel.');
  }

  const active = value.semesters.find((semester) => semester.id === value.activeSemesterId);
  if (!active) {
    throw new Error('O semestre ativo nao foi encontrado no backup.');
  }

  return value;
}
