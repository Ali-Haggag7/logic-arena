import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { PrismaService } from "../../common/prisma.service";
import { EmailService } from "../../common/email.service";

import { PassportModule } from "@nestjs/passport";
import { GoogleStrategy } from "./strategies/google.strategy";
import { GithubStrategy } from "./strategies/github.strategy";

@Module({
  imports: [PassportModule],
  providers: [AuthService, PrismaService, EmailService, GoogleStrategy, GithubStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Export AuthService if needed by other modules
})
export class AuthModule {}