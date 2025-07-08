import { ChatNotFoundError } from '../../../../../src/llm/domain/errors.js';
import { Chat, Message } from '../../../../../src/llm/domain/models/Chat.js';
import { CHAT_STORAGE_PREFIX, get, save } from '../../../../../src/llm/infrastructure/repositories/chat-repository.js';
import { temporaryStorage } from '../../../../../src/shared/infrastructure/key-value-storages/index.js';
import { catchErr, expect } from '../../../../test-helper.js';

const chatTemporaryStorage = temporaryStorage.withPrefix(CHAT_STORAGE_PREFIX);

describe('LLM | Integration | Infrastructure | Repositories | chat', function () {
  describe('#save', function () {
    afterEach(async function () {
      await chatTemporaryStorage.flushAll();
    });

    it('should persist the chat in cache', async function () {
      // given
      const chat = new Chat({
        id: 'someChatId',
        configurationId: 'someConfigurationId',
        hasAttachmentContextBeenAdded: false,
        messages: [
          new Message({ content: 'je suis user', isFromUser: true }),
          new Message({ content: 'je suis LLM', isFromUser: false }),
        ],
      });

      // when
      await save(chat);

      // then
      expect(await chatTemporaryStorage.get('someChatId')).to.deep.equal({
        id: 'someChatId',
        configurationId: 'someConfigurationId',
        hasAttachmentContextBeenAdded: false,
        messages: [
          { content: 'je suis user', isFromUser: true, notCounted: false },
          { content: 'je suis LLM', isFromUser: false, notCounted: false },
        ],
      });
    });
  });

  describe('#get', function () {
    afterEach(async function () {
      await chatTemporaryStorage.flushAll();
    });

    context('error cases', function () {
      context('when chat does not exist', function () {
        it('should throw a ChatNotFoundError', async function () {
          // given
          const chat = new Chat({
            id: 'someChatId',
            configurationId: 'someConfigurationId',
            hasAttachmentContextBeenAdded: false,
            messages: [
              new Message({ content: 'je suis user', isFromUser: true, notCounted: false }),
              new Message({ content: 'je suis LLM', isFromUser: false, notCounted: false }),
            ],
          });
          await save(chat);

          // when
          const err = await catchErr(get)('unChatQuiNexistePas');

          // then
          expect(err).to.be.instanceOf(ChatNotFoundError);
          expect(err.message).to.equal('The chat of id "unChatQuiNexistePas" does not exist');
        });
      });
    });

    context('success cases', function () {
      it('should return the chat', async function () {
        // given
        const chat = new Chat({
          id: 'someChatId',
          configurationId: 'someConfigurationId',
          hasAttachmentContextBeenAdded: false,
          messages: [
            new Message({ content: 'je suis user', isFromUser: true, notCounted: false }),
            new Message({ content: 'je suis LLM', isFromUser: false, notCounted: false }),
          ],
        });
        await save(chat);

        // when
        const actualChat = await get('someChatId');

        // then
        expect(actualChat).to.deepEqualInstance(chat);
      });
    });
  });
});
