import {
  Controller, Post, Body, Req, UseGuards,
  NotFoundException, BadRequestException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '../../common/auth.guard';
import { CampaignService } from '../campaign/campaign.service';
import { MatchEngine } from './match.engine';

interface CampaignFightDto {
  levelId: number;
  userScript: string;
}

@SkipThrottle({ auth: true })
@Controller('matches')
@UseGuards(AuthGuard)
export class MatchesController {
  constructor(private readonly campaignService: CampaignService) {}

  /** Synchronous campaign fight — no WebSocket, no DB persistence */
  @Post('campaign')
  async campaignFight(
    @Req() req: any,
    @Body() body: CampaignFightDto,
  ) {
    const { levelId, userScript } = body;

    if (!levelId || !userScript?.trim()) {
      throw new BadRequestException('levelId and userScript are required');
    }

    let enemyScript: string;
    try {
      enemyScript = this.campaignService.getEnemyScript(levelId);
    } catch (e: any) {
      throw new NotFoundException('Level not found');
    }

    const matchId = `campaign-${crypto.randomUUID()}`;
    const userId  = req.user.sub;

    const engine = new MatchEngine(matchId, [
      { id: userId,    script: userScript,  color: '#22d3ee' },
      { id: 'bot-2',   script: enemyScript, color: '#ef4444' },
    ]);

    const startMs = Date.now();
    return new Promise<{ won: boolean; durationSeconds: number }>((resolve) => {
      engine.start(100); // 100ms tick

      const MAX_TICKS = 300; // ~30 s cap
      let tick = 0;

      const check = setInterval(() => {
        tick++;
        const state = engine.getState();
        const robots = state.robots as any[];
        const aliveRobots = robots.filter((r) => r.health > 0);

        const isOver =
          robots.length > 0 && aliveRobots.length <= 1;

        const timedOut = tick >= MAX_TICKS;

        if (isOver || timedOut) {
          clearInterval(check);
          engine.stop();

          const userBot   = robots.find((r) => r.id === userId);
          const isAlive   = userBot && userBot.health > 0;
          const won       = isAlive && aliveRobots.length === 1;

          resolve({
            won: !!won,
            durationSeconds: Math.floor((Date.now() - startMs) / 1000),
          });
        }
      }, 150);
    });
  }
}
