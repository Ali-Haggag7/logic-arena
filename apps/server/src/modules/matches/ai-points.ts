import { AIDifficulty, Robot, KothModeData, CtfModeData, SurvivalModeData } from '@logic-arena/engine';

const DIFFICULTY_MULTIPLIER: Record<AIDifficulty, number> = {
  easy: 1,
  medium: 2,
  hard: 3,
};

const MODE_BASE_POINTS: Record<string, number> = {
  COMBAT: 50,
  CAPTURE_THE_FLAG: 60,
  KING_OF_THE_HILL: 50,
  SURVIVAL: 40,
  RACING: 30,
};

interface PointsResult {
  pointsAwarded: number;
  breakdown: {
    base: number;
    difficultyMultiplier: number;
    performance: number;
    performanceLabel: string;
  };
}

export function calculateAiMatchPoints(
  mode: string,
  difficulty: AIDifficulty,
  playerRobot: Robot | undefined,
  modeData: unknown,
  durationSecs: number,
): PointsResult {
  const base = MODE_BASE_POINTS[mode] ?? 30;
  const mult = DIFFICULTY_MULTIPLIER[difficulty];
  let performance = 0;
  let performanceLabel = 'participation';

  if (!playerRobot) {
    return {
      pointsAwarded: Math.round(base * mult * 0.1),
      breakdown: { base, difficultyMultiplier: mult, performance: 0, performanceLabel: 'no-show' },
    };
  }

  switch (mode) {
    case 'COMBAT': {
      const healthPercent = playerRobot.health;
      const speedBonus = Math.max(0, 30 - durationSecs) * 2;
      performance = Math.round(healthPercent * 1.5 + speedBonus);
      performanceLabel = healthPercent >= 80 ? 'decisive' : healthPercent >= 50 ? 'solid' : 'narrow';
      break;
    }
    case 'CAPTURE_THE_FLAG': {
      const ctfData = modeData as CtfModeData | undefined;
      const captures = ctfData?.teamScores?.[playerRobot.team] ?? 0;
      performance = captures * 40 + Math.max(0, 30 - durationSecs);
      performanceLabel = captures >= 3 ? 'perfect' : captures >= 2 ? 'strong' : captures >= 1 ? 'partial' : 'none';
      break;
    }
    case 'KING_OF_THE_HILL': {
      const kothData = modeData as KothModeData | undefined;
      const zoneScore = kothData?.zoneScores?.[playerRobot.team] ?? 0;
      const scoreTarget = kothData?.scoreTarget ?? 300;
      performance = Math.round((zoneScore / scoreTarget) * 100);
      performanceLabel = performance >= 90 ? 'dominant' : performance >= 60 ? 'solid' : 'contested';
      break;
    }
    case 'SURVIVAL': {
      const survData = modeData as SurvivalModeData | undefined;
      const wave = survData?.wave ?? 1;
      const kills = survData?.totalKills ?? 0;
      performance = (wave - 1) * 30 + kills * 5;
      performanceLabel = wave >= 8 ? 'legendary' : wave >= 5 ? 'survivor' : wave >= 3 ? 'veteran' : 'rookie';
      break;
    }
    case 'RACING': {
      const finishTime = Math.max(1, durationSecs);
      const timeScore = Math.max(0, Math.round((30 - finishTime) * 5));
      performance = timeScore + 10;
      performanceLabel = finishTime <= 5 ? 'record' : finishTime <= 10 ? 'fast' : finishTime <= 20 ? 'steady' : 'slow';
      break;
    }
  }

  const pointsAwarded = Math.max(1, Math.round((base + performance) * mult));
  return { pointsAwarded, breakdown: { base, difficultyMultiplier: mult, performance, performanceLabel } };
}
