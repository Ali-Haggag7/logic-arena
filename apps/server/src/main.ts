import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const isDev = process.env.NODE_ENV === 'development';

  // ── Security headers ──────────────────────────────────────────────────────
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      contentSecurityPolicy: isDev
        ? false
        : {
          directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
            connectSrc: ["'self'", 'ws:', 'wss:'],
          },
        },
    }),
  );

  // ── CORS ──────────────────────────────────────────────────────────────────
  app.enableCors({
    origin: isDev
      ? ['http://localhost:3000', 'http://127.0.0.1:3000']
      : [process.env.CLIENT_URL, 'https://logicarena.dev'].filter(Boolean),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ── WebSocket ─────────────────────────────────────────────────────────────
  app.useWebSocketAdapter(new IoAdapter(app));

  app.setGlobalPrefix('api');

  const port = process.env.PORT ?? 3001;
  console.log(`🚀 Logic Arena Server is LIVE on port ${port}`);
  await app.listen(port);
}

bootstrap();