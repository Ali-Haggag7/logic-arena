import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async findOne(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            select: { id: true, email: true, username: true, rank: true, createdAt: true }, // Exclude passwordHash
        });
    }

    async findOneByUsername(username: string) {
        return this.prisma.user.findUnique({
            where: { username },
            select: { id: true, email: true, username: true, rank: true, createdAt: true }, // Exclude passwordHash
        });
    }
}