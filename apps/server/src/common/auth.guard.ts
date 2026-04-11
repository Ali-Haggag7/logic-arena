import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader) {
            throw new UnauthorizedException('Authorization header not found');
        }

        const [type, token] = authHeader.split(' ');

        if (type !== 'Bearer') {
            throw new UnauthorizedException('Bearer token not found');
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            request.user = decoded;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid token');
        }
    }
}