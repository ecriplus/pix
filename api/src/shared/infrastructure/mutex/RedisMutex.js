import { config } from '../../config.js';
import { RedisClient } from '../utils/RedisClient.js';

class RedisMutex {
  constructor({ redisUrl }) {
    if (redisUrl) {
      this._client = new RedisClient(redisUrl, { name: 'mutex', prefix: 'mutex:' });
    }
  }

  /**
   *
   * @param { string } resourceId
   * @param { number } lockExpirationDelay - in milliseconds. Default value : 5 seconds less than HTTP server timeout
   * @returns { Promise<boolean> } true : successful lock
   */
  async lock(resourceId, lockExpirationDelay = config.timeouts.server - 5_000) {
    return (await this._client.set(resourceId, '1', 'PX', lockExpirationDelay, 'NX')) === 'OK';
  }

  /**
   *
   * @param { string } resourceId
   * @returns { Promise<boolean> } true : successful release
   */
  async release(resourceId) {
    return (await this._client.del(resourceId)) === 1;
  }

  async quit() {
    await this._client?.quit();
  }

  async clearAll() {
    const keys = (await this._client.keys('*')).map((key) => key.split('mutex:')[1]);
    for (const key of keys) {
      await this._client.del(key);
    }
  }
}

export const redisMutex = new RedisMutex({ redisUrl: config.mutex.redisUrl });

export function quitMutex() {
  return redisMutex.quit();
}

export function clearMutex() {
  const status = redisMutex._client?.status;
  if (status === 'ready') {
    return redisMutex.clearAll();
  }
}
