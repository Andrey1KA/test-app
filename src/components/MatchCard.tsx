import { StyleSheet, Text, View } from 'react-native';
import { formatKickoff, formatScore, formatStatus } from '../format';
import type { Match } from '../types';

type Props = {
  match: Match;
};

export function MatchCard({ match }: Props) {
  const score = formatScore(match.score);

  return (
    <View style={styles.card}>
      <View style={styles.teams}>
        <Text style={styles.team}>{match.home?.name ?? '—'}</Text>
        <Text style={styles.vs}>—</Text>
        <Text style={styles.team}>{match.away?.name ?? '—'}</Text>
      </View>
      {score ? <Text style={styles.score}>{score}</Text> : null}
      <View style={styles.meta}>
        <Text style={styles.kickoff}>{formatKickoff(match.startsAt)}</Text>
        <Text style={styles.status}>{formatStatus(match)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 14,
    gap: 8,
  },
  teams: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
    paddingRight: 48,
  },
  team: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  vs: {
    color: '#9ca3af',
  },
  score: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  meta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  kickoff: {
    fontSize: 13,
    color: '#4b5563',
    flexShrink: 1,
  },
  status: {
    fontSize: 13,
    color: '#4b5563',
  },
});
