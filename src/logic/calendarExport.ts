import { format, parseISO } from 'date-fns';
import type { CalendarEvent, Semester } from '../types';

function escapeICS(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

export function getSemesterEvents(semester: Semester): CalendarEvent[] {
  return semester.subjects
    .flatMap((subject) =>
      subject.evaluations
        .filter((evaluation) => Boolean(evaluation.date))
        .map((evaluation) => ({
          id: evaluation.id,
          subjectId: subject.id,
          subjectName: subject.name,
          subjectColor: subject.color,
          evaluation
        }))
    )
    .sort((a, b) => String(a.evaluation.date).localeCompare(String(b.evaluation.date)));
}

export function generateICS(semester: Semester): string {
  const now = format(new Date(), "yyyyMMdd'T'HHmmss'Z'");
  const events = getSemesterEvents(semester);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PUC Tracker//Academic Calendar//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  events.forEach((event) => {
    const date = parseISO(event.evaluation.date as string);
    const day = format(date, 'yyyyMMdd');
    const title = `${event.subjectName} — ${event.evaluation.name}`;

    lines.push(
      'BEGIN:VEVENT',
      `UID:${event.evaluation.id}@puc-tracker`,
      `DTSTAMP:${now}`,
      `DTSTART;VALUE=DATE:${day}`,
      `SUMMARY:${escapeICS(title)}`,
      `DESCRIPTION:${escapeICS(event.evaluation.type)}`,
      'END:VEVENT'
    );
  });

  lines.push('END:VCALENDAR');
  return `${lines.join('\r\n')}\r\n`;
}
