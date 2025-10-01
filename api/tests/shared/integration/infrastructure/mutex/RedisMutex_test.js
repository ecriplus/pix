import { config, config as settings } from '../../../../../src/shared/config.js';
import { redisMutex } from '../../../../../src/shared/infrastructure/mutex/RedisMutex.js';
import { RedisClient } from '../../../../../src/shared/infrastructure/utils/RedisClient.js';
import { expect, sinon, wait } from '../../../../test-helper.js';

const REDIS_URL = settings.redis.url;
describe('Shared | Integration | Infrastructure | Mutex | RedisMutex', function () {
  afterEach(async function () {
    const redisClient = new RedisClient(REDIS_URL, { name: 'mutex', prefix: 'mutex:' });
    const keys = (await redisClient.keys('*')).map((key) => key.split('mutex:')[1]);
    for (const key of keys) {
      await redisClient.del(key);
    }
  });

  describe('#lock', function () {
    it('should successfully lock resource for the first time, but fail the second time because resource is already locked', async function () {
      // when
      const isLockSuccess_firstCall = await redisMutex.lock('someResourceId');
      const isLockSuccess_secondCall = await redisMutex.lock('someResourceId');

      // then
      expect(isLockSuccess_firstCall).to.be.true;
      expect(isLockSuccess_secondCall).to.be.false;
    });

    it('should release automatically after expiration delay', async function () {
      sinon.stub(config.llm, 'lockChatExpirationDelayMilliseconds').value(250);
      await redisMutex.lock('someResourceId');

      // when
      const isLockSuccess_beforeDelay1 = await redisMutex.lock('someResourceId');
      await wait(100);
      const isLockSuccess_beforeDelay2 = await redisMutex.lock('someResourceId');
      await wait(151);
      const isLockSuccess_afterDelay = await redisMutex.lock('someResourceId');

      // then
      expect(isLockSuccess_beforeDelay1).to.be.false;
      expect(isLockSuccess_beforeDelay2).to.be.false;
      expect(isLockSuccess_afterDelay).to.be.true;
    });
  });

  describe('#release', function () {
    it('should successfully release the resource for the first time, but fail the second time because resource is already released', async function () {
      // given
      await redisMutex.lock('someResourceId');

      // when
      const isReleaseSuccess_firstCall = await redisMutex.release('someResourceId');
      const isReleaseSuccess_secondCall = await redisMutex.release('someResourceId');

      // then
      expect(isReleaseSuccess_firstCall).to.be.true;
      expect(isReleaseSuccess_secondCall).to.be.false;
    });
  });
});
