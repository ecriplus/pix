import * as llmApi from '../../../../../src/llm/application/api/llm-api.js';
import { LLMChatDTO } from '../../../../../src/llm/application/api/models/LLMChatDTO.js';
import { NoUserIdProvidedError } from '../../../../../src/llm/domain/errors.js';
import { Chat } from '../../../../../src/llm/domain/models/Chat.js';
import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import { usecases } from '../../../../../src/llm/domain/usecases/index.js';
import { catchErr, expect, sinon } from '../../../../test-helper.js';

describe('LLM | Unit | Application | API | llm', function () {
  describe('#startChat', function () {
    context('when no user id provided', function () {
      it('should throw a NoUserIdProvidedError', async function () {
        // when
        const err = await catchErr(llmApi.startChat)({ configId: 'someConfig', userId: null });

        // then
        expect(err).to.be.instanceOf(NoUserIdProvidedError);
        expect(err.message).to.equal('Must provide a user ID to use LLM API');
      });
    });

    context('when user id provided', function () {
      let startChat, newChat;

      beforeEach(function () {
        newChat = new Chat({
          id: '123e4567-e89b-12d3-a456-426614174000',
          configuration: new Configuration({
            attachmentName: 'file.txt',
            inputMaxChars: 456,
            inputMaxPrompts: 789,
          }),
        });
        startChat = sinon.stub(usecases, 'startChat').resolves(newChat);
      });

      it('should return the newly created chat with attachment info, diminushing inputMaxPrompts by one', async function () {
        const configId = 'abc123';
        const userId = 123;

        // when
        const chat = await llmApi.startChat({ configId, userId });

        // then
        expect(chat).to.deepEqualInstance(
          new LLMChatDTO({
            id: newChat.id,
            attachmentName: newChat.configuration.attachmentName,
            inputMaxChars: newChat.configuration.inputMaxChars,
            inputMaxPrompts: newChat.configuration.inputMaxPrompts,
          }),
        );
        expect(startChat).to.have.been.calledOnceWithExactly({ configId, userId });
      });
    });
  });
});
