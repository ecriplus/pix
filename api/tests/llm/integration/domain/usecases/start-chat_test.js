import { Chat } from '../../../../../src/llm/domain/models/Chat.js';
import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import { startChat } from '../../../../../src/llm/domain/usecases/start-chat.js';
import { chatRepository, configurationRepository } from '../../../../../src/llm/infrastructure/repositories/index.js';
import { temporaryStorage } from '../../../../../src/shared/infrastructure/key-value-storages/index.js';
import { expect, nock, sinon } from '../../../../test-helper.js';

const chatTemporaryStorage = temporaryStorage.withPrefix(chatRepository.CHAT_STORAGE_PREFIX);

describe('LLM | Integration | Domain | UseCases | start-chat', function () {
  afterEach(async function () {
    await chatTemporaryStorage.flushAll();
  });

  describe('#startChat', function () {
    let randomUUID;

    beforeEach(async function () {
      randomUUID = sinon.stub().returns('123e4567-e89b-12d3-a456-426614174000');
    });

    context('when config object provided', function () {
      let configuration;

      beforeEach(function () {
        configuration = new Configuration({
          llm: {
            historySize: 123,
          },
          challenge: {
            inputMaxChars: 456,
            inputMaxPrompts: 789,
          },
          attachment: {
            name: 'file.txt',
            context: '**coucou**',
          },
        });
      });

      it('should return the newly created chat', async function () {
        // when
        const chat = await startChat({ configuration, randomUUID, chatRepository });

        // then
        expect(chat).to.deepEqualInstance(
          new Chat({
            id: '123e4567-e89b-12d3-a456-426614174000',
            configuration: new Configuration({}), // Configuration’s properties are not enumerable
            hasAttachmentContextBeenAdded: false,
          }),
        );
        expect(await chatTemporaryStorage.get('123e4567-e89b-12d3-a456-426614174000')).to.deep.equal({
          id: '123e4567-e89b-12d3-a456-426614174000',
          configuration: {
            llm: {
              historySize: 123,
            },
            challenge: {
              inputMaxChars: 456,
              inputMaxPrompts: 789,
            },
            attachment: {
              name: 'file.txt',
              context: '**coucou**',
            },
          },
          hasAttachmentContextBeenAdded: false,
          messages: [],
        });
      });
    });

    context('when config object not provided', function () {
      let configurationId, userId, llmApiScope, config;

      beforeEach(function () {
        configurationId = 'uneConfigQuiExist';
        userId = 123456;
        config = {
          llm: {
            historySize: 123,
          },
          challenge: {
            inputMaxChars: 456,
            inputMaxPrompts: 789,
          },
          attachment: {
            name: 'file.txt',
            context: '**coucou**',
          },
        };
        llmApiScope = nock('https://llm-test.pix.fr/api').get('/configurations/uneConfigQuiExist').reply(200, config);
      });

      it('should return the newly created chat', async function () {
        // when
        const chat = await startChat({ configurationId, userId, randomUUID, chatRepository, configurationRepository });

        // then
        expect(chat).to.deepEqualInstance(
          new Chat({
            id: '123e4567-e89b-12d3-a456-426614174000',
            userId: 123456,
            configurationId: 'uneConfigQuiExist',
            configuration: new Configuration({}), // Configuration’s properties are not enumerable
            hasAttachmentContextBeenAdded: false,
          }),
        );
        expect(llmApiScope.isDone()).to.be.true;
        expect(await chatTemporaryStorage.get('123e4567-e89b-12d3-a456-426614174000')).to.deep.equal({
          id: '123e4567-e89b-12d3-a456-426614174000',
          userId: 123456,
          configurationId: 'uneConfigQuiExist',
          configuration: {
            llm: {
              historySize: 123,
            },
            challenge: {
              inputMaxChars: 456,
              inputMaxPrompts: 789,
            },
            attachment: {
              name: 'file.txt',
              context: '**coucou**',
            },
          },
          hasAttachmentContextBeenAdded: false,
          messages: [],
        });
      });
    });
  });
});
