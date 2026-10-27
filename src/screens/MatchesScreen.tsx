import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { fetchMatches } from '../api/fetchMatches';
import { MatchCard } from '../components/MatchCard';
import { UpdatedAgo } from '../components/UpdatedAgo';
import { FILTERS, filterMatches, type MatchFilter } from '../filterMatches';
import type { Match } from '../types';

export function MatchesScreen() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [round, setRound] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [filter, setFilter] = useState<MatchFilter>('all');

  const load = useCallback(async (mode: 'initial' | 'refresh') => {
    if (mode === 'initial') setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const data = await fetchMatches();
      setMatches(data.matches);
      setRound(typeof data.round === 'number' ? data.round : null);
      setUpdatedAt(new Date());
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Не удалось загрузить матчи');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void load('initial');
  }, [load]);

  const visible = filterMatches(matches, filter);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Матчи тура{round != null ? ` ${round}` : ''}</Text>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" />
          <Text style={styles.hint}>Загружаем матчи…</Text>
        </View>
      ) : error && updatedAt == null ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Pressable style={styles.button} onPress={() => void load('initial')}>
            <Text style={styles.buttonText}>Повторить</Text>
          </Pressable>
        </View>
      ) : (
        <>
          <View style={styles.toolbar}>
            {updatedAt ? <UpdatedAgo since={updatedAt} /> : null}
            <Pressable onPress={() => void load('refresh')} disabled={refreshing}>
              <Text style={styles.refresh}>{refreshing ? 'Обновляем…' : 'Обновить'}</Text>
            </Pressable>
          </View>
          {error ? <Text style={styles.error}>{error}</Text> : null}
          <View style={styles.filters}>
            {FILTERS.map((item) => {
              const selected = item.id === filter;
              return (
                <Pressable
                  key={item.id}
                  style={[styles.filter, selected && styles.filterSelected]}
                  onPress={() => setFilter(item.id)}
                >
                  <Text style={[styles.filterText, selected && styles.filterTextSelected]}>
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
          {visible.length === 0 ? (
            <View style={styles.center}>
              <Text style={styles.hint}>
                {matches.length === 0 ? 'Матчей в этом туре нет' : 'В этом фильтре матчей нет'}
              </Text>
            </View>
          ) : (
            <FlatList
              data={visible}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={() => void load('refresh')} />
              }
              renderItem={({ item }) => <MatchCard match={item} />}
            />
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filter: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#d1d5db',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  filterSelected: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  filterText: {
    fontSize: 14,
    color: '#111827',
  },
  filterTextSelected: {
    color: '#fff',
  },
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  refresh: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  list: {
    gap: 10,
    paddingBottom: 24,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  hint: {
    fontSize: 16,
    color: '#4b5563',
  },
  error: {
    fontSize: 16,
    color: '#b91c1c',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#111827',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
