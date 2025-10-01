import { config } from '../../config.js';
import { RedisClient } from '../utils/RedisClient.js';

class RedisMutex {
  constructor({ redisUrl }) {
    this._client = new RedisClient(redisUrl, { name: 'mutex', prefix: 'mutex:' });
  }

  /**
   *
   * @param { string } resourceId
   * @returns { Promise<boolean> } true : successful lock
   */
  async lock(resourceId) {
    return (
      (await this._client.set(resourceId, '1', 'PX', config.llm.lockChatExpirationDelayMilliseconds, 'NX')) === 'OK'
    );
  }

  /**
   *
   * @param { string } resourceId
   * @returns { Promise<boolean> } true : successful release
   */
  async release(resourceId) {
    return (await this._client.del(resourceId)) === 1;
  }
}

export const redisMutex = new RedisMutex({ redisUrl: config.redis.url });
