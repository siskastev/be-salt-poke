import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    private readonly client: Redis;

    constructor() {
        this.client = new Redis({
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT, 10),
        });
    }

    getClient(): Redis {
        return this.client;
    }

    async getFromCache(key: string): Promise<any> {
        const cachedData = await this.client.get(key);
        return cachedData ? JSON.parse(cachedData) : null;
    }

    async saveToCache(key: string, data: any, expiresInSeconds: number = 300): Promise<void> {
        await this.client.set(key, JSON.stringify(data), 'EX', expiresInSeconds);
    }

    async removeFromCache(key: string): Promise<void> {
        await this.client.del(key);
    }
}
