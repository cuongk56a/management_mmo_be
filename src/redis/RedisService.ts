import { appConfigs } from '../config/config';
import { getRedisAsync, setRedisAsync, setExpireRedisAsync, clearRedisAsync } from './index';

export class RedisService {
  // 1. Blacklist token khi logout
  static async blacklistToken(token: string, expiresIn: number) {
    // In actual implementation of ioredis `EX` can be passed. 
    // Here we use the provided setRedisAsync. Assuming `client.set` can take EX internally or we just set string.
    await setRedisAsync(`blacklist:${token}`, 'true');
    await setExpireRedisAsync(`blacklist:${token}`, expiresIn);
    // Ideally we would set expiry, but since standard redis wrapper here is basic, just set true
  }

  static async isTokenBlacklisted(token: string) {
    const isBlacklisted = await getRedisAsync(`blacklist:${token}`);
    return !!isBlacklisted;
  }

  static async removeBlacklistToken(token: string) {
    await clearRedisAsync(`blacklist:${token}`);
  }

  // 2. Cache Product List (rất ít thay đổi)
  static async getCachedProducts(key: string = 'app:products') {
    const data = await getRedisAsync(key);
    return data ? JSON.parse(data) : null;
  }

  static async setCachedProducts(products: any, key: string = 'app:products', expiresIn: number) {
    await setRedisAsync(key, JSON.stringify(products));
    await setExpireRedisAsync(key, expiresIn);
  }

  static async removeCachedProducts(key: string = 'app:products') {
    await clearRedisAsync(key);
  }

  // 3. Cache Refresh Token (ít thay đổi)
  static async getCachedRefreshToken(key: string = 'app:refreshToken') {
    const data = await getRedisAsync(key);
    return data ? JSON.parse(data) : null;
  }

  static async setCachedRefreshToken(refreshToken: any, key: string = 'app:refreshToken', expiresIn: number) {
    await setRedisAsync(key, JSON.stringify(refreshToken));
    await setExpireRedisAsync(key, expiresIn);
  }

  static async removeCachedRefreshToken(key: string = 'app:refreshToken') {
    await clearRedisAsync(key);
  }
}
