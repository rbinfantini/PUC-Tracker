import { describe, expect, it } from 'vitest';
import type { AppData } from '../types';
import { validateImportedData } from '../data/storage';

const validData: AppData = {
  version: 1,
  activeSemesterId: 'semester-1',
  semesters: [
    {
      id: 'semester-1',
      name: '2026.1',
      year: 2026,
      period: 1,
      isActive: true,
      subjects: []
    }
  ]
};

describe('backup/importacao', () => {
  it('aceita dados versionados com semestre ativo existente', () => {
    expect(validateImportedData(validData)).toEqual(validData);
  });

  it('rejeita formato sem versionamento correto', () => {
    expect(() => validateImportedData({ version: 2, semesters: [], activeSemesterId: '' })).toThrow();
  });

  it('rejeita backup sem o semestre ativo indicado', () => {
    expect(() => validateImportedData({ ...validData, activeSemesterId: 'missing' })).toThrow();
  });
});
