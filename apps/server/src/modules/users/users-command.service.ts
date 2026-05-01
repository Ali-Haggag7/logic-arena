import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../../common/prisma.service';
import { RedisService } from '../../common/redis.service';
import { ALLOWED_ROBOT_IDS, COLOR_REGEX, profileKey, loadoutKey, preferencesKey, BCRYPT_ROUNDS, PRISMA_UNIQUE_VIOLATION, ArenaPreferences, NotificationSettings } from './types';

@Injectable()
export class UsersCommandService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) { }

  async updateLoadout(userId: string, robotId: string, color: string): Promise<void> {
    if (!ALLOWED_ROBOT_IDS.includes(robotId)) {
      throw new Error(`Invalid robotId "${robotId}". Must be one of: ${ALLOWED_ROBOT_IDS.join(', ')}`);
    }
    if (color !== 'DEFAULT' && !COLOR_REGEX.test(color)) {
      throw new Error(`Invalid color "${color}". Must match #rrggbb format or be "DEFAULT".`);
    }

    await this.prisma.user.update({
      where: { id: userId },
      data: { selectedRobotId: robotId, selectedColor: color },
    });

    await this.redis.del(profileKey(userId), loadoutKey(userId));
  }

  async updateIdentity(
    userId: string,
    data: { username?: string; email?: string },
  ): Promise<void> {
    if (!data.username && !data.email) return;
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data,
      });
      await this.redis.del(profileKey(userId), loadoutKey(userId));
    } catch (err: unknown) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === PRISMA_UNIQUE_VIOLATION
      ) {
        const target = (err.meta?.target as string[]) ?? [];
        if (target.includes('username')) throw new ConflictException('Username already taken');
        if (target.includes('email')) throw new ConflictException('Email already registered');
      }
      throw err;
    }
  }

  async updatePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { passwordHash: true },
    });
    if (!user?.passwordHash) {
      throw new UnauthorizedException('Account uses OAuth — password cannot be changed here');
    }
    const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }
    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: userId },
      data: { passwordHash: newHash },
    });
  }

  async updateArenaPreferences(
    userId: string,
    prefs: Partial<ArenaPreferences>,
  ): Promise<void> {
    if (prefs.defaultRobot !== undefined && !ALLOWED_ROBOT_IDS.includes(prefs.defaultRobot)) {
      throw new Error(`Invalid defaultRobot "${prefs.defaultRobot}". Must be one of: ${ALLOWED_ROBOT_IDS.join(', ')}`);
    }
    const current = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { arenaPreferences: true },
    });
    const merged = { ...(current?.arenaPreferences as unknown as ArenaPreferences ?? {}), ...prefs };
    await this.prisma.user.update({
      where: { id: userId },
      data: { arenaPreferences: merged },
    });
    await this.redis.del(profileKey(userId), preferencesKey(userId));
  }

  async updateNotificationSettings(
    userId: string,
    settings: Partial<NotificationSettings>,
  ): Promise<void> {
    const current = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { notificationSettings: true },
    });
    const merged = { ...(current?.notificationSettings as unknown as NotificationSettings ?? {}), ...settings };
    await this.prisma.user.update({
      where: { id: userId },
      data: { notificationSettings: merged },
    });
    await this.redis.del(profileKey(userId), preferencesKey(userId));
  }

  async deleteAccount(userId: string, confirmation: string): Promise<void> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { username: true }
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.username !== confirmation) {
      throw new UnauthorizedException('Confirmation mismatch');
    }

    await this.prisma.user.delete({ where: { id: userId } });
    await this.redis.del(profileKey(userId), loadoutKey(userId));
  }
}
