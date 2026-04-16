export interface MatchEntry {
  id: string;
  date: string;
  type: string;
  opponent: string;
  result: "WIN" | "LOSS";
  duration: number; // seconds
}

export interface ProfileData {
  username: string;
  rank: number;
  memberSince: string;
  totalMatches: number;
  wins: number;
  losses: number;
  winRate: number;
  matchHistory: MatchEntry[];
}
