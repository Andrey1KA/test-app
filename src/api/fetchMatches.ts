import { MATCHES_URL } from '../config';
import type { MatchesResponse } from '../types';

export async function fetchMatches(): Promise<MatchesResponse> {
  const response = await fetch(MATCHES_URL);
  if (!response.ok) {
    throw new Error(`Сервер ответил ${response.status}`);
  }

  const data: unknown = await response.json();
  if (!isMatchesResponse(data)) {
    throw new Error('Некорректный ответ сервера');
  }

  return data;
}

function isMatchesResponse(data: unknown): data is MatchesResponse {
  if (!data || typeof data !== 'object') return false;
  return Array.isArray((data as MatchesResponse).matches);
}
