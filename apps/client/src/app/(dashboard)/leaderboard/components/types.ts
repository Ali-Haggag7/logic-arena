import type { LeaderboardUser } from "../types";

export interface LeaderboardViewProps {
  users: LeaderboardUser[];
  isLoading: boolean;
  currentUserId: string;
  onChallenge: (userId: string) => void;
  onSpectate: (matchId: string) => void;
  isGuest: boolean;
}
