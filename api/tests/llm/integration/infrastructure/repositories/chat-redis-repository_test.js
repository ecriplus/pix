import { ChatNotFoundError } from '../../../../../src/llm/domain/errors.js';
import { Chat, Message } from '../../../../../src/llm/domain/models/Chat.js';
import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import {
  CHAT_STORAGE_PREFIX,
  get,
  save,
} from '../../../../../src/llm/infrastructure/repositories/chat-redis-repository.js';
import { temporaryStorage } from '../../../../../src/shared/infrastructure/key-value-storages/index.js';
import { catchErr, expect, nock } from '../../../../test-helper.js';

const chatTemporaryStorage = temporaryStorage.withPrefix(CHAT_STORAGE_PREFIX);

describe('LLM | Integration | Infrastructure | Repositories | chat-redis', function () {
  afterEach(async function () {
    await chatTemporaryStorage.flushAll();
  });

  describe('#save', function () {
    it('should persist the chat in cache', async function () {
      // given
      const chat = new Chat({
        id: 'someChatId',
        userId: 123,
        configurationId: 'some-config-id',
        configuration: new Configuration({
          llm: {
            historySize: 10,
          },
          challenge: {
            inputMaxChars: 500,
            inputMaxPrompts: 4,
          },
          attachment: {
            name: 'test.csv',
            context: 'le contexte',
          },
        }),
        hasAttachmentContextBeenAdded: false,
        messages: [
          new Message({
            index: 0,
            content: 'je suis user',
            isFromUser: true,
            shouldBeRenderedInPreview: true,
            shouldBeForwardedToLLM: true,
            shouldBeCountedAsAPrompt: true,
          }),
          new Message({
            index: 1,
            content: 'je suis LLM',
            isFromUser: false,
            shouldBeRenderedInPreview: true,
            shouldBeForwardedToLLM: true,
            shouldBeCountedAsAPrompt: false,
          }),
        ],
      });

      // when
      await save(chat);

      // then
      expect(await chatTemporaryStorage.get('someChatId')).to.deep.equal({
        id: 'someChatId',
        userId: 123,
        configurationId: 'some-config-id',
        configuration: {
          llm: {
            historySize: 10,
          },
          challenge: {
            inputMaxChars: 500,
            inputMaxPrompts: 4,
          },
          attachment: {
            name: 'test.csv',
            context: 'le contexte',
          },
        },
        hasAttachmentContextBeenAdded: false,
        messages: [
          {
            index: 0,
            content: 'je suis user',
            isFromUser: true,
            shouldBeRenderedInPreview: true,
            shouldBeForwardedToLLM: true,
            shouldBeCountedAsAPrompt: true,
          },
          {
            index: 1,
            content: 'je suis LLM',
            isFromUser: false,
            shouldBeRenderedInPreview: true,
            shouldBeForwardedToLLM: true,
            shouldBeCountedAsAPrompt: false,
          },
        ],
      });
    });
  });

  describe('#get', function () {
    context('error cases', function () {
      context('when chat does not exist', function () {
        it('should throw a ChatNotFoundError', async function () {
          // given
          await chatTemporaryStorage.save({
            key: 'someChatId',
            value: {
              id: 'someChatId',
              userId: 123,
              configurationId: 'some-config-id',
              configuration: {},
              hasAttachmentContextBeenAdded: false,
              messages: [
                { content: 'je suis user', isFromUser: true, notCounted: false },
                { content: 'je suis LLM', isFromUser: false, notCounted: false },
              ],
            },
          });

          // when
          const err = await catchErr(get)('unChatQuiNexistePas');

          // then
          expect(err).to.be.instanceOf(ChatNotFoundError);
          expect(err.message).to.equal('The chat of id "unChatQuiNexistePas" does not exist');
        });
      });
    });

    context('success cases', function () {
      it('returns the chat', async function () {
        // given
        await chatTemporaryStorage.save({
          key: 'someChatId',
          value: {
            id: 'someChatId',
            userId: 123,
            configurationId: 'some-config-id',
            configuration: {
              llm: {
                historySize: 10,
              },
              challenge: {
                inputMaxChars: 500,
                inputMaxPrompts: 4,
                victoryConditions: {
                  expectations: ['super_expectations'],
                },
              },
              attachment: {
                name: 'test.csv',
                context: 'le contexte',
              },
            },
            hasAttachmentContextBeenAdded: false,
            messages: [
              { content: 'je suis user', isFromUser: true, notCounted: false },
              { content: 'je suis LLM', isFromUser: false, notCounted: false },
            ],
          },
        });

        // when
        const actualChat = await get('someChatId');

        // then
        expect(actualChat).to.deepEqualInstance(
          new Chat({
            id: 'someChatId',
            userId: 123,
            configurationId: 'some-config-id',
            configuration: new Configuration({
              configuration: {
                challenge: {
                  victoryConditions: {
                    expectations: ['super_expectations'],
                  },
                },
              },
            }), // configuration properties are not enumerable
            hasAttachmentContextBeenAdded: false,
            messages: [
              new Message({ index: 0, content: 'je suis user', isFromUser: true }),
              new Message({ index: 1, content: 'je suis LLM', isFromUser: false }),
            ],
          }),
        );
        expect(actualChat.configuration.toDTO()).to.deep.equal({
          llm: {
            historySize: 10,
          },
          challenge: {
            inputMaxChars: 500,
            inputMaxPrompts: 4,
            victoryConditions: {
              expectations: ['super_expectations'],
            },
          },
          attachment: {
            name: 'test.csv',
            context: 'le contexte',
          },
        });
      });

      context('when chat contains a stale configuration', function () {
        it('loads configuration and returns chat with fresh configuration', async function () {
          // given
          await chatTemporaryStorage.save({
            key: 'someChatId',
            value: {
              id: 'someChatId',
              userId: 123,
              configuration: {
                id: 'some-config-id',
                historySize: 1,
                inputMaxChars: 2,
                inputMaxPrompts: 3,
                attachmentName: 'some_attachment_name',
                attachmentContext: 'some attachment context',
              },
              hasAttachmentContextBeenAdded: false,
              messages: [
                { index: 0, content: 'je suis user', isFromUser: true, notCounted: false },
                { index: 1, content: 'je suis LLM', isFromUser: false, notCounted: false },
              ],
            },
          });
          const llmApiScope = nock('https://llm-test.pix.fr/api')
            .get('/configurations/some-config-id')
            .reply(200, {
              llm: { historySize: 1 },
              challenge: { inputMaxChars: 2, inputMaxPrompts: 3 },
              attachment: { name: 'some_attachment_name', context: 'some attachment context' },
            });

          // when
          const actualChat = await get('someChatId');

          // then
          expect(actualChat).to.deepEqualInstance(
            new Chat({
              id: 'someChatId',
              userId: 123,
              configurationId: 'some-config-id',
              configuration: new Configuration({}), // configuration properties are not enumerable
              hasAttachmentContextBeenAdded: false,
              messages: [
                new Message({ index: 0, content: 'je suis user', isFromUser: true }),
                new Message({ index: 1, content: 'je suis LLM', isFromUser: false }),
              ],
            }),
          );
          expect(actualChat.configuration.toDTO()).to.deep.equal({
            llm: { historySize: 1 },
            challenge: { inputMaxChars: 2, inputMaxPrompts: 3 },
            attachment: { name: 'some_attachment_name', context: 'some attachment context' },
          });
          expect(llmApiScope.isDone()).to.be.true;
        });
      });
    });
  });
});
