import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { RedisService } from './redis/redis.service';
import { CachingService } from './caching/caching.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [RedisService, RedisService, CachingService],
})
export class AppModule {}
