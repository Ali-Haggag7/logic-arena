import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';

import { PrismaService } from '../../common/prisma.service';
import { EmailService } from '../../common/email.service';
import { randomInt } from 'crypto';

/** Number of bcrypt hashing rounds — OWASP recommends ≥ 10; 12 is a good balance. */
const BCRYPT_ROUNDS = 12;

/** Prisma unique-constraint field names for the User model. */
const PRISMA_UNIQUE_VIOLATION = 'P2002';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // ---------------------------------------------------------------------------
  // Public API
  // ---------------------------------------------------------------------------

  async register(email: string, username: string, password: string) {
    const passwordHash = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const verifyCode = randomInt(100000, 999999).toString();
    const verifyExpiry = new Date(Date.now() + 15 * 60 * 1000);

    try {
      const user = await this.prisma.user.create({
        data: { email, username, passwordHash, isVerified: false, verifyCode, verifyExpiry },
      });

      try {
        await this.emailService.sendVerificationCode(email, verifyCode);
      } catch (emailErr: any) {
        // Account created but email delivery failed — surface clearly
        throw new InternalServerErrorException(
          `Account created but verification email failed: ${emailErr.message}`,
        );
      }
      return this.stripPassword(user);
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === PRISMA_UNIQUE_VIOLATION
      ) {
        // Prisma surfaces the conflicting field(s) in `error.meta.target`
        const target = (error.meta?.target as string[]) ?? [];
        if (target.includes('username')) {
          throw new ConflictException('Username already taken');
        }
        if (target.includes('email')) {
          throw new ConflictException('Email already registered');
        }
        throw new ConflictException('Account already exists');
      }
      throw error;
    }
  }

  async login(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username } });

    // Use a constant-time compare even when user doesn't exist to prevent
    // timing-based user enumeration attacks.
    const dummyHash =
      '$2b$12$invalidhashfortimingprotectionxxxxxxxxxxxxxxxxxxxxxxxxxx';
    const hash = user?.passwordHash ?? dummyHash;
    const isValid = await bcrypt.compare(password, hash);

    if (!user || !isValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    if (!user.isVerified) {
      throw new UnauthorizedException('Please verify your email first');
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('Server misconfiguration');
    }

    const payload = { username: user.username, sub: user.id };
    return {
      accessToken: jwt.sign(payload, secret, { expiresIn: '1h' }),
    };
  }

  async verifyEmail(email: string, code: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.verifyCode !== code || !user.verifyExpiry || user.verifyExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired verification code');
    }
    await this.prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true, verifyCode: null, verifyExpiry: null },
    });
    return { success: true };
  }

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return { success: true }; // don't leak user existence
    
    const resetCode = randomInt(100000, 999999).toString();
    const resetExpiry = new Date(Date.now() + 15 * 60 * 1000);
    
    await this.prisma.user.update({
      where: { id: user.id },
      data: { resetCode, resetExpiry },
    });
    try {
      await this.emailService.sendResetCode(email, resetCode);
    } catch (emailErr: any) {
      throw new InternalServerErrorException(
        `Reset code saved but email delivery failed: ${emailErr.message}`,
      );
    }
    return { success: true };
  }

  async resetPassword(email: string, code: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user || user.resetCode !== code || !user.resetExpiry || user.resetExpiry < new Date()) {
      throw new UnauthorizedException('Invalid or expired reset code');
    }
    const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await this.prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetCode: null, resetExpiry: null },
    });
    return { success: true };
  }

  async findOrCreateOAuthUser(data: {
    provider: string;
    providerId: string;
    email: string;
    username: string;
    avatarUrl?: string;
  }) {
    const providerField = data.provider === 'google' ? 'googleId' : 'githubId';
    
    // Check if user exists with this provider ID
    let user = await this.prisma.user.findFirst({
      where: { [providerField]: data.providerId },
    });

    if (!user) {
      // Check if email already exists
      const existingUser = await this.prisma.user.findUnique({
        where: { email: data.email },
      });

      if (existingUser) {
        // Link OAuth to existing account
        user = await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            [providerField]: data.providerId,
            avatarUrl: data.avatarUrl,
            provider: data.provider,
            isVerified: true,
          },
        });
      } else {
        // Create new user
        let username = data.username;
        const existing = await this.prisma.user.findUnique({ where: { username } });
        if (existing) username = `${username}_${Date.now()}`;

        user = await this.prisma.user.create({
          data: {
            email: data.email,
            username,
            passwordHash: null,
            [providerField]: data.providerId,
            avatarUrl: data.avatarUrl,
            provider: data.provider,
            isVerified: true,
          },
        });
      }
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new InternalServerErrorException('Server misconfiguration');
    }

    // Return JWT
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: jwt.sign(payload, secret, { expiresIn: '1h' }),
      userId: user.id,
      username: user.username,
    };
  }

  // ---------------------------------------------------------------------------
  // Private helpers
  // ---------------------------------------------------------------------------

  /** Returns a copy of the user object without the passwordHash field. */
  private stripPassword(user: User): Omit<User, 'passwordHash'> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash: _removed, ...safe } = user;
    return safe;
  }
}
