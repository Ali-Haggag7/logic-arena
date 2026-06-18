import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import {
  ThrottlerModule,
  ThrottlerGuard,
  type ThrottlerModuleOptions,
} from '@nestjs/throttler';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './common/prisma.service';
import { RedisModule } from './common/redis.module';
import { HttpCacheInterceptor } from './common/interceptors/http-cache.interceptor';
import { AuthModule } from './modules/auth/auth.module';
import { ScriptsModule } from './modules/scripts/scripts.module';
import { UsersModule } from './modules/users/users.module';
import { MatchesModule } from './modules/matches/matches.module';
import { TournamentsModule } from './modules/tournaments/tournaments.module';
import { CampaignModule } from './modules/campaign/campaign.module';
import { AiModule } from './modules/ai/ai.module';
import { FeedbackModule } from './modules/feedback/feedback.module';
import { AdminModule } from './modules/admin/admin.module';
import { AchievementsModule } from './modules/achievements/achievements.module';
import { FriendsModule } from './modules/friends/friends.module';

/**
 * Returns throttler config that bypasses limits in dev when THROTTLE_SKIP=true.
 */
function throttlerConfig(): ThrottlerModuleOptions {
  const skip =
    process.env.THROTTLE_SKIP === 'true' &&
    process.env.NODE_ENV !== 'production';

  if (skip) {
    return [
      { name: 'global', ttl: 1, limit: 999_999 },
      { name: 'auth', ttl: 1, limit: 999_999 },
    ];
  }

  return [
    { name: 'global', ttl: 60_000, limit: 60 },
    { name: 'auth', ttl: 900_000, limit: 5 },
  ];
}

@Module({
  imports: [
    // ── Global Redis (singleton) ─────────────────────────────────────────────
    RedisModule,

    // ── Rate-limiting ────────────────────────────────────────────────────────
    ThrottlerModule.forRoot(throttlerConfig()),

    // ── Feature modules ──────────────────────────────────────────────────────
    AuthModule,
    ScriptsModule,
    UsersModule,
    MatchesModule,
    TournamentsModule,
    CampaignModule,
    AiModule,
    FeedbackModule,
    AdminModule,
    AchievementsModule,
    FriendsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    PrismaService,
    // ── Global throttle guard ────────────────────────────────────────────────
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    // ── Global HTTP cache interceptor (X-Cache header + Redis caching) ───────
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
  ],
})
export class AppModule {}
