import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { AuthGuard } from '../../common/auth.guard';
import { NotificationsService } from './notifications.service';
import { NotificationEntry } from './types';

interface AuthenticatedRequest {
  user: { sub: string };
}

interface NotificationListResponse {
  items: NotificationEntry[];
  total: number;
  unreadCount: number;
  hasMore: boolean;
}

const MAX_PAGE_SIZE = 50;

@SkipThrottle({ auth: true })
@UseGuards(AuthGuard)
@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notifications: NotificationsService) {}

  @Get()
  async list(
    @Req() req: AuthenticatedRequest,
    @Query('skip') skip = '0',
    @Query('take') take = '20',
  ): Promise<NotificationListResponse> {
    const safeSkip = Math.max(0, Number.parseInt(skip, 10) || 0);
    const safeTake = Math.min(MAX_PAGE_SIZE, Math.max(1, Number.parseInt(take, 10) || 20));
    const result = await this.notifications.list(req.user.sub, safeSkip, safeTake);
    return {
      ...result,
      hasMore: safeSkip + result.items.length < result.total,
    };
  }

  @Get('unread-count')
  async unreadCount(@Req() req: AuthenticatedRequest): Promise<{ count: number }> {
    const count = await this.notifications.countUnread(req.user.sub);
    return { count };
  }

  @Patch(':id/read')
  async markRead(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<{ success: true; unreadCount: number }> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid notification id');
    }
    const updated = await this.notifications.markRead(req.user.sub, id);
    if (!updated) {
      throw new NotFoundException('Notification not found');
    }
    const unreadCount = await this.notifications.countUnread(req.user.sub);
    return { success: true, unreadCount };
  }

  @Post('read-all')
  @HttpCode(HttpStatus.OK)
  async markAllRead(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ success: true; count: number; unreadCount: number }> {
    const result = await this.notifications.markAllRead(req.user.sub);
    return { success: true, count: result.count, unreadCount: 0 };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async deleteOne(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
  ): Promise<{ success: true; unreadCount: number }> {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid notification id');
    }
    const deleted = await this.notifications.delete(req.user.sub, id);
    if (!deleted) {
      throw new NotFoundException('Notification not found');
    }
    const unreadCount = await this.notifications.countUnread(req.user.sub);
    return { success: true, unreadCount };
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  async deleteAll(
    @Req() req: AuthenticatedRequest,
  ): Promise<{ success: true; count: number; unreadCount: number }> {
    const result = await this.notifications.deleteAll(req.user.sub);
    return { success: true, count: result.count, unreadCount: 0 };
  }
}

function isUuid(value: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}
