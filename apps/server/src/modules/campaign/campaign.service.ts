import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { CAMPAIGN_LEVELS } from './campaign.data';

@Injectable()
export class CampaignService {
  constructor(private readonly prisma: PrismaService) {}

  async getLevels(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const currentLevel = user?.currentLevel ?? 1;
    return CAMPAIGN_LEVELS.map((level) => ({
      id:          level.id,
      name:        level.name,
      difficulty:  level.difficulty,
      description: level.description,
      rewardRank:  level.rewardRank,
      unlocked:    level.id <= currentLevel,
      completed:   level.id < currentLevel,
    }));
  }

  async getLevel(userId: string, levelId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const currentLevel = user?.currentLevel ?? 1;
    if (levelId > currentLevel) throw new Error('LEVEL_LOCKED');
    const level = CAMPAIGN_LEVELS.find((l) => l.id === levelId);
    if (!level) throw new Error('LEVEL_NOT_FOUND');
    return { ...level, unlocked: true };
  }

  async completeLevel(userId: string, levelId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('USER_NOT_FOUND');
    if (levelId !== user.currentLevel) throw new Error('INVALID_LEVEL');
    const level = CAMPAIGN_LEVELS.find((l) => l.id === levelId);
    if (!level) throw new Error('LEVEL_NOT_FOUND');

    const nextLevel = Math.min(levelId + 1, 10);
    await this.prisma.user.update({
      where: { id: userId },
      data: {
        currentLevel: nextLevel,
        rank:         { increment: level.rewardRank },
      },
    });
    return { nextLevel, rewardRank: level.rewardRank };
  }

  getEnemyScript(levelId: number): string {
    const level = CAMPAIGN_LEVELS.find((l) => l.id === levelId);
    if (!level) throw new Error('LEVEL_NOT_FOUND');
    return level.enemyScript;
  }
}
