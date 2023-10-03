import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './src/app.module';
import { RedisService } from './src/redis/redis.service';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        host: '0.0.0.0',
        port: 4000,
      },
    },
  );

  const redisService = app.get(RedisService);
  await redisService.getClient();
  await app.listen();
}
bootstrap();
