import type { Match, Score } from './types';

const STATUS_LABEL: Record<string, string> = {
  finished: 'Завершён',
  live: 'Идёт',
  scheduled: 'Предстоящий',
  postponed: 'Перенесён',
};

export function formatKickoff(startsAt: string | null): string {
  if (!startsAt) return 'Дата не назначена';

  const date = new Date(startsAt);
  if (Number.isNaN(date.getTime())) return 'Некорректная дата';

  return date.toLocaleString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatStatus(match: Match): string {
  if (match.status === 'live' && typeof match.minute === 'number') {
    return `Идёт, ${match.minute} мин`;
  }
  return STATUS_LABEL[match.status] ?? 'Неизвестный статус';
}

export function formatScore(score: Score | null): string | null {
  if (!score) return null;
  return `${score.home}:${score.away}`;
}
