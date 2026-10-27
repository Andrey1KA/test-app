export type Club = {
  id: string;
  name: string;
  city: string;
};

export type Score = {
  home: number;
  away: number;
};

export type Match = {
  id: string;
  startsAt: string | null;
  status: string;
  minute?: number;
  home: Club;
  away: Club;
  score: Score | null;
};

export type MatchesResponse = {
  round?: number;
  matches: Match[];
};
