import type { Match } from './types';

export type MatchFilter = 'all' | 'upcoming' | 'finished';

export const FILTERS: { id: MatchFilter; label: string }[] = [
  { id: 'all', label: 'Все' },
  { id: 'upcoming', label: 'Предстоящие' },
  { id: 'finished', label: 'Завершённые' },
];

// «Идёт» и «перенесён» не предстоящие и не завершённые — остаются только во «Все».
export function filterMatches(matches: Match[], filter: MatchFilter): Match[] {
  if (filter === 'finished') {
    return matches.filter((match) => match.status === 'finished');
  }
  if (filter === 'upcoming') {
    return matches.filter((match) => match.status === 'scheduled');
  }
  return matches;
}
