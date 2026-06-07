import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import { RedisService } from './redis.service';
import {
  AUTH_COOKIE_NAME,
  JwtPayload,
  sessionVersionKey,
} from '../modules/auth/types';

/**
 * HTTP guard that authenticates requests but does NOT throw if unauthorized.
 * If no valid session is found, it assigns `request.user = { sub: 'guest' }`.
 * This allows endpoints to serve public/guest data safely.
 */
@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private readonly redis: RedisService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractToken(request);
    if (!token) {
      request.user = { sub: 'guest' } as any;
      return true;
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      request.user = { sub: 'guest' } as any;
      return true;
    }

    try {
      const decoded = jwt.verify(token, secret) as JwtPayload;
      const currentSessionVersion = await this.redis.get<number>(
        sessionVersionKey(decoded.sub),
      );
      if ((currentSessionVersion ?? 0) !== (decoded.sessionVersion ?? 0)) {
        request.user = { sub: 'guest' } as any;
        return true;
      }
      request.user = decoded as any;
      return true;
    } catch {
      request.user = { sub: 'guest' } as any;
      return true;
    }
  }

  private extractToken(request: Request): string | undefined {
    // ── 1. HttpOnly cookie (preferred) ──────────────────────────────────────
    const cookieToken = request.cookies?.[AUTH_COOKIE_NAME] as
      | string
      | undefined;
    if (cookieToken) return cookieToken;

    // ── 2. Authorization header fallback (server-to-server / WS upgrade) ───
    const authHeader = request.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.slice(7);
    }

    return undefined;
  }
}
