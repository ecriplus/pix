import { randomUUID } from 'node:crypto';

import { Chat, Message } from '../../../../../src/llm/domain/models/Chat.js';
import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import { save } from '../../../../../src/llm/infrastructure/repositories/chat-repository.js';
import { expect, knex, sinon } from '../../../../test-helper.js';

describe('LLM | Integration | Infrastructure | Repositories | chat', function () {
  let clock, now;

  beforeEach(function () {
    clock = sinon.useFakeTimers(new Date('2025-09-26'));
    now = new Date(clock.now);
  });

  afterEach(function () {
    clock.restore();
  });

  describe('#save', function () {
    it('should persist the chat and messages in database', async function () {
      // given
      const uuid = randomUUID();
      const moduleId = randomUUID();
      const chat = new Chat({
        id: uuid,
        userId: 123,
        passageId: 234,
        moduleId,
        configurationId: 'some-config-id',
        configuration: new Configuration({
          id: 'configuration-id',
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
        hasAttachmentContextBeenAdded: true,
        messages: [
          new Message({
            content: 'je suis user',
            isFromUser: true,
            attachmentName: 'attachmentName',
            attachmentContext: 'attachmentContext',
            shouldBeRenderedInPreview: true,
            shouldBeForwardedToLLM: true,
            shouldBeCountedAsAPrompt: true,
            hasAttachmentBeenSubmittedAlongWithAPrompt: true,
            haveVictoryConditionsBeenFulfilled: false,
          }),
          new Message({
            content: 'je suis LLM',
            isFromUser: false,
            shouldBeRenderedInPreview: true,
            shouldBeForwardedToLLM: true,
            shouldBeCountedAsAPrompt: false,
            hasAttachmentBeenSubmittedAlongWithAPrompt: false,
            haveVictoryConditionsBeenFulfilled: true,
          }),
          new Message({
            content: 'message modéré',
            isFromUser: true,
            shouldBeRenderedInPreview: true,
            shouldBeForwardedToLLM: true,
            shouldBeCountedAsAPrompt: false,
            haveVictoryConditionsBeenFulfilled: false,
            wasModerated: true,
            hasErrorOccurred: true,
          }),
        ],
      });
      const chatDTO = chat.toDTO();

      // when
      await save(chat);

      // then
      const insertedChat = await knex.select().from('chats').where({ id: chat.id }).first();
      const messages = await knex.select().from('chat_messages').where({ chatId: chat.id }).orderBy('index');

      expect(insertedChat).to.deep.include({
        id: chatDTO.id,
        passageId: chatDTO.passageId,
        moduleId: chatDTO.moduleId,
        configContent: chatDTO.configuration,
        hasAttachmentContextBeenAdded: true,
        startedAt: now,
        updatedAt: now,
      });

      expect(messages).to.have.lengthOf(3);
      expect(messages[0]).to.deep.include({
        chatId: chatDTO.id,
        index: 1,
        emitter: 'user',
        content: 'je suis user',
        attachmentName: 'attachmentName',
        attachmentContext: 'attachmentContext',
        shouldBeRenderedInPreview: true,
        shouldBeForwardedToLLM: true,
        shouldBeCountedAsPrompt: true,
        hasAttachmentBeenSubmittedAlongWithAPrompt: true,
        haveVictoryConditionsBeenFulfilled: false,
        wasModerated: null,
      });

      expect(messages[1]).to.deep.include({
        chatId: chatDTO.id,
        index: 2,
        emitter: 'assistant',
        content: 'je suis LLM',
        shouldBeRenderedInPreview: true,
        shouldBeForwardedToLLM: true,
        shouldBeCountedAsPrompt: false,
        hasAttachmentBeenSubmittedAlongWithAPrompt: false,
        haveVictoryConditionsBeenFulfilled: true,
        wasModerated: null,
      });

      expect(messages[2]).to.deep.include({
        chatId: chatDTO.id,
        index: 3,
        emitter: 'user',
        content: 'message modéré',
        shouldBeRenderedInPreview: true,
        shouldBeForwardedToLLM: true,
        shouldBeCountedAsPrompt: false,
        haveVictoryConditionsBeenFulfilled: false,
        wasModerated: true,
        hasErrorOccurred: true,
      });
    });
  });
});
