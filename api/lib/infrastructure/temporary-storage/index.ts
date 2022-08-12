// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'settings'.
const settings = require('../../config');
const REDIS_URL = settings.poleEmploi.temporaryStorage.redisUrl;

// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'InMemoryTe... Remove this comment to see the full error message
const InMemoryTemporaryStorage = require('./InMemoryTemporaryStorage');
// @ts-expect-error TS(2451): Cannot redeclare block-scoped variable 'RedisTempo... Remove this comment to see the full error message
const RedisTemporaryStorage = require('./RedisTemporaryStorage');

function _createTemporaryStorage() {
  if (REDIS_URL) {
    return new RedisTemporaryStorage(REDIS_URL);
  } else {
    return new InMemoryTemporaryStorage();
  }
}

// @ts-expect-error TS(2580): Cannot find name 'module'. Do you need to install ... Remove this comment to see the full error message
module.exports = _createTemporaryStorage();
