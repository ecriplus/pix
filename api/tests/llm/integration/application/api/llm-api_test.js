import { prompt, startChat } from '../../../../../src/llm/application/api/llm-api.js';
import { ChatNotFoundError, ConfigurationNotFoundError } from '../../../../../src/llm/domain/errors.js';
import { CHAT_STORAGE_PREFIX } from '../../../../../src/llm/infrastructure/repositories/chat-repository.js';
import { CONFIGURATION_STORAGE_PREFIX } from '../../../../../src/llm/infrastructure/repositories/configuration-repository.js';
import { temporaryStorage } from '../../../../../src/shared/infrastructure/key-value-storages/index.js';
import { catchErr, expect, nock, sinon } from '../../../../test-helper.js';

const chatTemporaryStorage = temporaryStorage.withPrefix(CHAT_STORAGE_PREFIX);
const configurationTemporaryStorage = temporaryStorage.withPrefix(CONFIGURATION_STORAGE_PREFIX);

describe('LLM | Integration | Application | API | llm', function () {
  afterEach(async function () {
    await chatTemporaryStorage.flushAll();
    await configurationTemporaryStorage.flushAll();
  });

  describe('#startChat', function () {
    let clock, now;

    beforeEach(async function () {
      now = new Date('2023-10-05T18:02:00Z');
      clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
    });

    afterEach(async function () {
      clock.restore();
    });

    context('when no config id provided', function () {
      it('should throw a ConfigurationNotFoundError', async function () {
        // given
        const configId = null;

        // when
        const err = await catchErr(startChat)({ configId, prefixIdentifier: 'someUniquePrefix' });

        // then
        expect(err).to.be.instanceOf(ConfigurationNotFoundError);
        expect(err.message).to.equal('The configuration of id "null id provided" does not exist');
      });
    });

    context('when config id provided', function () {
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
        expect(await chatTemporaryStorage.get(`someUniquePrefix-${now.getMilliseconds()}`)).to.deep.equal({
          id: `someUniquePrefix-${now.getMilliseconds()}`,
          configurationId: 'uneConfigQuiExist',
          historySize: 123,
          inputMaxChars: 456,
          inputMaxPrompts: 789,
        });
      });
    });
  });

  describe('#prompt', function () {
    context('when no chat id provided', function () {
      it('should throw a ChatNotFoundError', async function () {
        // given
        const chatId = null;

        // when
        const err = await catchErr(prompt)({ chatId, message: 'un message' });

        // then
        expect(err).to.be.instanceOf(ChatNotFoundError);
        expect(err.message).to.equal('The chat of id "null id provided" does not exist');
      });
    });

    it('should return the newly created chat', async function () {
      // when
      const chatResponseDTO = await prompt({ chatId: 'un chat id', message: 'un message' });

      // then
      expect(chatResponseDTO).to.deep.equal({
        message: `un message BIEN RECU dans chat un chat id`,
      });
    });
  });
});
