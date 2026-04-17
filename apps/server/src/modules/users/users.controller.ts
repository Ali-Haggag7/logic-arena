import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { PrismaService } from '../../common/prisma.service';
import { RedisService }  from '../../common/redis.service';
import { AuthGuard }     from '../../common/auth.guard';
import { UsersService }  from './users.service';

const LEADERBOARD_KEY = 'leaderboard:top10';
const LEADERBOARD_TTL = 30; // seconds

@SkipThrottle({ auth: true })
@Controller('users')
export class UsersController {
  constructor(
    private readonly prisma:       PrismaService,
    private readonly usersService: UsersService,
    private readonly redis:        RedisService,
  ) {}

  // ── Leaderboard (public, cached 30 s) ────────────────────────────────────
  @Get('leaderboard')
  async getLeaderboard() {
    const cached = await this.redis.get<unknown>(LEADERBOARD_KEY);
    if (cached) return cached;

    const data = await this.prisma.user.findMany({
      orderBy: { rank: 'desc' },
      take:    10,
      select:  {
        id:       true,
        username: true,
        rank:     true,
        _count:   { select: { wonMatches: true } },
      },
    });

    await this.redis.set(LEADERBOARD_KEY, data, LEADERBOARD_TTL);
    return data;
  }

  // ── My Profile (auth-gated, Redis-first via service) ─────────────────────
  @UseGuards(AuthGuard)
  @Get('profile')
  async getProfile(@Req() req: any) {
    const userId: string = req.user.sub;
    const profile = await this.usersService.getProfile(userId);

    if (!profile) {
      return { username: 'UNKNOWN', totalMatches: 0, wins: 0, losses: 0, winRate: 0, rank: 0, matchHistory: [] };
    }

    return profile;
  }

  // ── Update Loadout (auth-gated, invalidates profile cache) ───────────────
  @UseGuards(AuthGuard)
  @Patch('profile')
  async updateProfile(
    @Req() req: any,
    @Body() body: { robotId: string; color: string },
  ) {
    try {
      await this.usersService.updateLoadout(req.user.sub, body.robotId, body.color);
      return { success: true };
    } catch (err: any) {
      throw new BadRequestException(err.message);
    }
  }

  // ── Match Replay (auth-gated) ─────────────────────────────────────────────
  @UseGuards(AuthGuard)
  @Get('matches/:matchId/replay')
  async getReplay(@Param('matchId') matchId: string) {
    const match = await this.prisma.match.findUnique({
      where:  { id: matchId },
      select: { id: true, replayData: true, winnerId: true, duration: true, createdAt: true },
    });
    if (!match) throw new NotFoundException('Match not found');
    return match;
  }
}
