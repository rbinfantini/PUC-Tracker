import { differenceInCalendarDays, format, isValid, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function parseDate(value?: string): Date | null {
  if (!value) return null;
  const date = parseISO(value);
  return isValid(date) ? date : null;
}

export function formatShortDate(value?: string): string {
  const date = parseDate(value);
  return date ? format(date, "dd 'de' MMM", { locale: ptBR }) : 'Sem data';
}

export function formatCountdown(value?: string, now = new Date()): string {
  const date = parseDate(value);
  if (!date) return 'sem data';

  const days = differenceInCalendarDays(date, now);
  if (days === 0) return 'hoje';
  if (days === 1) return 'amanha';
  if (days === -1) return 'ontem';
  if (days > 1) return `em ${days} dias`;
  return `ha ${Math.abs(days)} dias`;
}

export function monthKey(date: Date): string {
  return format(date, 'yyyy-MM');
}

export function toDateInputValue(date = new Date()): string {
  return format(date, 'yyyy-MM-dd');
}
