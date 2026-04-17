import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService }    from './users.service';
import { PrismaService }   from '../../common/prisma.service';

// RedisService is provided globally via RedisModule (imported in AppModule)

@Module({
  controllers: [UsersController],
  providers:   [UsersService, PrismaService],
  exports:     [UsersService],
})
export class UsersModule {}
