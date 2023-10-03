import { Injectable } from '@nestjs/common';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class CachingService {
  constructor(private readonly redisService: RedisService) {}

  async set(key: string, value: string): Promise<void> {
    const client = this.redisService.getClient();
    await client.set(key, value);
  }

  async get(key: string): Promise<string | null> {
    const client = this.redisService.getClient();
    return client.get(key);
  }
}
