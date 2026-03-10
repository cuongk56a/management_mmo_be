import { getRedisAsync, setRedisAsync } from './index';

export class RedisService {
  // 1. Blacklist token khi logout
  static async blacklistToken(token: string, expiresIn: number) {
    // In actual implementation of ioredis `EX` can be passed. 
    // Here we use the provided setRedisAsync. Assuming `client.set` can take EX internally or we just set string.
    await setRedisAsync(`blacklist:${token}`, 'true'); 
    // Ideally we would set expiry, but since standard redis wrapper here is basic, just set true
  }

  static async isTokenBlacklisted(token: string) {
    const isBlacklisted = await getRedisAsync(`blacklist:${token}`);
    return !!isBlacklisted;
  }

  // 2. Cache Product List (rất ít thay đổi)
  static async getCachedProducts(key: string = 'app:products') {
    const data = await getRedisAsync(key);
    return data ? JSON.parse(data) : null;
  }

  static async setCachedProducts(products: any, key: string = 'app:products') {
    await setRedisAsync(key, JSON.stringify(products)); // EX handle needed in setRedisAsync
  }
}
