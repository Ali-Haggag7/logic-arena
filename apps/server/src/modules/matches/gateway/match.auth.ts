import * as jwt from 'jsonwebtoken';
import { RedisService } from '../../../common/redis.service';
import { AUTH_COOKIE_NAME, JwtPayload } from '../../auth/types';
import { AuthenticatedSocket } from './types';

function extractWsToken(client: AuthenticatedSocket): string | undefined {
  const cookieHeader = client.handshake?.headers?.cookie ?? '';
  const cookieMatch = cookieHeader
    .split(';')
    .map((c) => c.trim())
    .find((c) => c.startsWith(`${AUTH_COOKIE_NAME}=`));
  if (cookieMatch) return cookieMatch.slice(AUTH_COOKIE_NAME.length + 1);

  const authToken = client.handshake?.auth?.token as string | undefined;
  if (authToken) return authToken.replace(/^Bearer\s+/i, '');

  const authHeader = client.handshake?.headers?.authorization;
  if (authHeader?.startsWith('Bearer ')) return authHeader.slice(7);

  return undefined;
}

export async function authenticateSocket(
  client: AuthenticatedSocket,
  redisService: RedisService,
): Promise<void> {
  const token = extractWsToken(client);

  if (!token) {
    client.userId = `guest_${client.id}`;
    client.isGuest = true;
    client.emit('authenticated', { userId: client.userId, isGuest: true });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string,
    ) as JwtPayload;
    client.userId = decoded.sub;
    await redisService.set(`user:online:${client.userId}`, '1', 300);
    client.emit('authenticated', { userId: client.userId });
  } catch {
    client.userId = `guest_${client.id}`;
    client.isGuest = true;
    client.emit('authenticated', { userId: client.userId, isGuest: true });
  }
}
