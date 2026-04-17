import {
  Controller, Get, Post, Param, Req,
  UseGuards, NotFoundException, ForbiddenException, BadRequestException,
} from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { CampaignService } from './campaign.service';
import { AuthGuard } from '../../common/auth.guard';

@SkipThrottle({ auth: true })
@Controller('campaign')
@UseGuards(AuthGuard)
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get('levels')
  getLevels(@Req() req: any) {
    return this.campaignService.getLevels(req.user.sub);
  }

  @Get('levels/:id')
  async getLevel(@Req() req: any, @Param('id') id: string) {
    try {
      return await this.campaignService.getLevel(req.user.sub, parseInt(id, 10));
    } catch (e: any) {
      if (e.message === 'LEVEL_LOCKED')    throw new ForbiddenException('Level is locked');
      if (e.message === 'LEVEL_NOT_FOUND') throw new NotFoundException('Level not found');
      throw e;
    }
  }

  @Post('levels/:id/complete')
  async completeLevel(@Req() req: any, @Param('id') id: string) {
    try {
      return await this.campaignService.completeLevel(req.user.sub, parseInt(id, 10));
    } catch (e: any) {
      if (e.message === 'INVALID_LEVEL')   throw new BadRequestException('Not your current level');
      if (e.message === 'USER_NOT_FOUND')  throw new NotFoundException('User not found');
      throw e;
    }
  }
}
