export interface CampaignLevel {
  id: number;
  name: string;
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'ELITE';
  description: string;
  rewardRank: number;
  enemyScript: string;
}

export const CAMPAIGN_LEVELS: CampaignLevel[] = [
  {
    id: 1,
    name: 'UNIT ALPHA',
    difficulty: 'EASY',
    description: 'A basic patrol unit. Moves right. Nothing more.',
    rewardRank: 10,
    enemyScript: `MOVE RIGHT\nMOVE RIGHT\nFIRE`,
  },
  {
    id: 2,
    name: 'SENTINEL MK-I',
    difficulty: 'EASY',
    description: 'Fires repeatedly. No spatial awareness.',
    rewardRank: 15,
    enemyScript: `FIRE\nFIRE\nFIRE\nMOVE LEFT`,
  },
  {
    id: 3,
    name: 'CRAWLER',
    difficulty: 'EASY',
    description: 'Alternates between moving and firing.',
    rewardRank: 20,
    enemyScript: `MOVE RIGHT\nFIRE\nMOVE LEFT\nFIRE`,
  },
  {
    id: 4,
    name: 'GHOST UNIT',
    difficulty: 'MEDIUM',
    description: 'Uses SCAN to detect enemies before engaging.',
    rewardRank: 30,
    enemyScript: `SET x = SCAN\nIF x > 0\n  FIRE\n  FIRE\nELSE\n  MOVE RIGHT\nEND`,
  },
  {
    id: 5,
    name: 'HUNTER',
    difficulty: 'MEDIUM',
    description: 'Aggressive. Moves toward target and fires on sight.',
    rewardRank: 40,
    enemyScript: `SET x = SCAN\nIF x > 0\n  FIRE\nELSE\n  MOVE RIGHT\n  MOVE RIGHT\nEND\nFIRE`,
  },
  {
    id: 6,
    name: 'VIPER',
    difficulty: 'MEDIUM',
    description: 'Uses loops to fire bursts continuously.',
    rewardRank: 50,
    enemyScript: `SET i = 0\nWHILE i < 5\n  FIRE\n  SET i = i + 1\nEND\nMOVE LEFT`,
  },
  {
    id: 7,
    name: 'PHANTOM',
    difficulty: 'HARD',
    description: 'Scan-based targeting with burst fire and repositioning.',
    rewardRank: 70,
    enemyScript: `SET x = SCAN\nIF x > 0\n  FIRE\n  FIRE\n  FIRE\n  MOVE LEFT\nELSE\n  MOVE RIGHT\n  MOVE RIGHT\nEND`,
  },
  {
    id: 8,
    name: 'DECIMATOR',
    difficulty: 'HARD',
    description: 'Full control loop. Aggressive repositioning after every burst.',
    rewardRank: 90,
    enemyScript: `SET i = 0\nWHILE i < 3\n  SET x = SCAN\n  IF x > 0\n    FIRE\n    FIRE\n  ELSE\n    MOVE RIGHT\n  END\n  SET i = i + 1\nEND\nMOVE LEFT\nFIRE`,
  },
  {
    id: 9,
    name: 'NEMESIS',
    difficulty: 'ELITE',
    description: 'Adaptive. Scans, repositions, and fires in calculated bursts.',
    rewardRank: 120,
    enemyScript: `SET found = 0\nSET i = 0\nWHILE i < 4\n  SET found = SCAN\n  IF found > 0\n    FIRE\n    FIRE\n    FIRE\n    MOVE LEFT\n    SET i = 4\n  ELSE\n    MOVE RIGHT\n    SET i = i + 1\n  END\nEND`,
  },
  {
    id: 10,
    name: 'OVERLORD',
    difficulty: 'ELITE',
    description: 'The final boss. Full tactical logic. Defeat it to prove mastery.',
    rewardRank: 200,
    enemyScript: `SET shield = 3\nSET i = 0\nWHILE i < 6\n  SET x = SCAN\n  IF x > 0\n    FIRE\n    FIRE\n    FIRE\n    FIRE\n    MOVE LEFT\n    MOVE LEFT\n  ELSE\n    MOVE RIGHT\n    FIRE\n    SET i = i + 1\n  END\nEND`,
  },
];
