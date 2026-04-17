import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, of, tap } from 'rxjs';
import { RedisService } from '../redis.service';

const CACHE_TTL = 60; // seconds — public non-user-specific GET responses

/**
 * Global HTTP cache interceptor.
 *
 * Rules:
 *  - Only caches GET requests.
 *  - Skips routes with an Authorization header (user-specific data).
 *  - Adds `X-Cache: HIT | MISS | BYPASS | DEGRADED` to every response.
 */
@Injectable()
export class HttpCacheInterceptor implements NestInterceptor {
  constructor(private readonly redis: RedisService) {}

  async intercept(ctx: ExecutionContext, next: CallHandler): Promise<Observable<unknown>> {
    const req = ctx.switchToHttp().getRequest<{
      url: string;
      method: string;
      headers: Record<string, string>;
    }>();
    const res = ctx.switchToHttp().getResponse<{
      setHeader: (k: string, v: string) => void;
    }>();

    // Only cache public GET — skip auth-gated and mutating requests
    if (req.method !== 'GET' || req.headers['authorization']) {
      res.setHeader('X-Cache', 'BYPASS');
      return next.handle();
    }

    // Redis unavailable → degrade gracefully
    if (!this.redis.healthy) {
      res.setHeader('X-Cache', 'DEGRADED');
      return next.handle();
    }

    const cacheKey = `http:${req.url}`;
    const cached   = await this.redis.get<unknown>(cacheKey);

    if (cached !== null) {
      res.setHeader('X-Cache', 'HIT');
      return of(cached);
    }

    res.setHeader('X-Cache', 'MISS');

    return next.handle().pipe(
      tap(async (response) => {
        await this.redis.set(cacheKey, response, CACHE_TTL);
      }),
    );
  }
}
