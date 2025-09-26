import { randomUUID } from 'node:crypto';

import { Chat, Message } from '../../../../../src/llm/domain/models/Chat.js';
import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import { save } from '../../../../../src/llm/infrastructure/repositories/chat-repository.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../test-helper.js';

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
    context('when there is no chats or messages existing in database with chat id passed in parameter', function () {
      it('should save the chat and messages correctly in database', async function () {
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
          configId: chatDTO.configurationId,
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
    context('when there is already a chat with no messages existing in database', function () {
      let databaseChat;

      beforeEach(async function () {
        databaseChat = databaseBuilder.factory.buildChat();
        await databaseBuilder.commit();
      });

      it('should save a chat with same chat id correctly without updating the startedAt field', async function () {
        // given
        await clock.tickAsync('01:00:00');
        const updatedAtWithDifferentDateFromStartedAt = new Date(clock.now);
        const chat = new Chat({
          ...databaseChat,
          configuration: new Configuration(databaseChat.configContent),
          totalInputTokens: 3,
          totalOutputTokens: 4,
          messages: [],
        });

        // when
        await save(chat);

        // then
        const insertedChat = await knex.select().from('chats').where({ id: databaseChat.id }).first();

        expect(insertedChat).to.deep.equal({
          ...databaseChat,
          totalInputTokens: 3,
          totalOutputTokens: 4,
          updatedAt: updatedAtWithDifferentDateFromStartedAt,
          startedAt: now,
        });
      });
    });

    context('when there is already a chat with messages existing in database', function () {
      let databaseChat, firstDatabaseChatMessage, secondDatabaseChatMessage;

      beforeEach(async function () {
        databaseChat = databaseBuilder.factory.buildChat();
        firstDatabaseChatMessage = databaseBuilder.factory.buildChatMessage({ chatId: databaseChat.id });
        secondDatabaseChatMessage = databaseBuilder.factory.buildChatMessage({
          chatId: databaseChat.id,
          index: 2,
          emitter: 'assistant',
        });

        await databaseBuilder.commit();
      });

      it('should save only new messages related to the chat with same chat id', async function () {
        const firstMessage = new Message({
          ...firstDatabaseChatMessage,
          isFromUser: true,
          shouldBeCountedAsAPrompt: firstDatabaseChatMessage.shouldBeCountedAsPrompt,
        });
        const secondMessage = new Message({
          ...secondDatabaseChatMessage,
          isFromUser: false,
          content: 'Content not to be saved',
          shouldBeCountedAsAPrompt: secondDatabaseChatMessage.shouldBeCountedAsPrompt,
        });
        const thirdMessage = new Message({
          content: 'contenu qui respecte les conditions de victoires : merguez',
          isFromUser: true,
          shouldBeRenderedInPreview: false,
          shouldBeForwardedToLLM: true,
          shouldBeCountedAsAPrompt: true,
          haveVictoryConditionsBeenFulfilled: true,
        });

        const chat = new Chat({
          ...databaseChat,
          configuration: new Configuration(databaseChat.configContent),
          totalInputTokens: 3,
          totalOutputTokens: 4,
          messages: [firstMessage, secondMessage, thirdMessage],
        });

        // when
        await save(chat);

        // then
        const messages = await knex.select().from('chat_messages').where({ chatId: chat.id }).orderBy('index');

        expect(messages).to.have.lengthOf(3);
        expect(messages[0]).deep.equal(firstDatabaseChatMessage);
        expect(messages[1]).deep.equal(secondDatabaseChatMessage);
        expect(messages[1].content).to.not.equal('Content not to be saved');
        expect(messages[2]).to.deep.include({
          chatId: databaseChat.id,
          index: 3,
          emitter: 'user',
          content: thirdMessage.content,
          shouldBeRenderedInPreview: false,
          shouldBeForwardedToLLM: true,
          shouldBeCountedAsPrompt: true,
          haveVictoryConditionsBeenFulfilled: true,
          wasModerated: null,
        });
      });
    });
  });
});
