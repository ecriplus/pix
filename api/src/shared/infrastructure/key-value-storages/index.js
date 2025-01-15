import { config } from '../../config.js';

const redisUrl = config.temporaryStorage.redisUrl;

import { InMemoryKeyValueStorage } from './InMemoryKeyValueStorage.js';
import { RedisKeyValueStorage } from './RedisKeyValueStorage.js';

function _createKeyValueStorage({ prefix }) {
  if (redisUrl) {
    return new RedisKeyValueStorage(redisUrl, prefix);
  } else {
    return new InMemoryKeyValueStorage();
  }
}

export const temporaryStorage = _createKeyValueStorage({ prefix: 'temporary-storage:' });
export const informationBannersStorage = _createKeyValueStorage({ prefix: 'information-banners:' });
