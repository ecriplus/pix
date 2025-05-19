import { startChat, STORAGE_PREFIX } from '../../../../../src/llm/application/api/llm-api.js';
import { temporaryStorage } from '../../../../../src/shared/infrastructure/key-value-storages/index.js';
import { expect, nock, sinon } from '../../../../test-helper.js';
const llmChatsTemporaryStorage = temporaryStorage.withPrefix(STORAGE_PREFIX);

describe('LLM | Integration | Application | API | llm', function () {
  let clock, now;

  beforeEach(async function () {
    now = new Date('2023-10-05T18:02:00Z');
    clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
  });

  afterEach(async function () {
    clock.restore();
    await llmChatsTemporaryStorage.flushAll();
  });

  context('when no config id provided', function () {
    it('should return null', async function () {
      // given
      const configId = null;

      // when
      const chat = await startChat({ configId, prefixIdentifier: 'someUniquePrefix' });

      // then
      expect(chat).to.be.null;
    });
  });

  context('when config id provided', function () {
    context('when config does not exist', function () {
      it('should return null', async function () {
        // given
        const configId = 'uneConfigQuiExistePo';
        const llmApiScope = nock('https://llm-test.pix.fr/api')
          .get('/configurations/uneConfigQuiExistePo')
          .reply(404, {});

        // when
        const chat = await startChat({ configId, prefixIdentifier: 'someUniquePrefix' });

        // then
        expect(chat).to.be.null;
        expect(llmApiScope.isDone()).to.be.true;
      });
    });

    context('when config exists', function () {
      let configId, llmApiScope, config;
      beforeEach(function () {
        configId = 'uneConfigQuiExist';
        config = {
          llm: {
            historySize: 123,
          },
          challenge: {
            inputMaxChars: 456,
            inputMaxPrompts: 789,
          },
        };
        llmApiScope = nock('https://llm-test.pix.fr/api').get('/configurations/uneConfigQuiExist').reply(200, config);
      });

      it('should return the newly created chat', async function () {
        // when
        const chat = await startChat({ configId, prefixIdentifier: 'someUniquePrefix' });

        // then
        expect(chat).to.deep.equal({
          id: `someUniquePrefix-${now.getMilliseconds()}`,
          inputMaxChars: 456,
          inputMaxPrompts: 789,
        });
        expect(llmApiScope.isDone()).to.be.true;
        expect(await llmChatsTemporaryStorage.get(`someUniquePrefix-${now.getMilliseconds()}`)).to.deep.equal({
          id: `someUniquePrefix-${now.getMilliseconds()}`,
          llmConfigurationId: 'uneConfigQuiExist',
          historySize: 123,
          inputMaxChars: 456,
          inputMaxPrompts: 789,
        });
      });
    });
  });
});
