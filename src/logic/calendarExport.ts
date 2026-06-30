import type { CalendarEvent, Semester } from '../types';

function escapeICS(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function toICSDate(value?: string): string | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  return value.replace(/-/g, '');
}

function utcTimestamp(date = new Date()): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}Z$/, 'Z');
}

export function getSemesterEvents(semester: Semester): CalendarEvent[] {
  return semester.subjects
    .flatMap((subject) =>
      subject.evaluations
        .filter((evaluation) => Boolean(toICSDate(evaluation.date)))
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
  const now = utcTimestamp();
  const events = getSemesterEvents(semester);
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//PUC Tracker//Academic Calendar//PT-BR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];

  events.forEach((event) => {
    const day = toICSDate(event.evaluation.date);
    if (!day) return;
    const title = `${event.subjectName} \u2014 ${event.evaluation.name}`;

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
