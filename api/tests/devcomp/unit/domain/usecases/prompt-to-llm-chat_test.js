import { Passage } from '../../../../../src/devcomp/domain/models/Passage.js';
import { promptToLLMChat } from '../../../../../src/devcomp/domain/usecases/prompt-to-llm-chat.js';
import { LLMChatResponseDTO } from '../../../../../src/llm/application/api/models/LLMChatResponseDTO.js';
import { DomainError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, expect, sinon } from '../../../../test-helper.js';

describe('Unit | Devcomp | Domain | UseCases | prompt-to-llm-chat', function () {
  let llmApi, passageRepository;
  const chatId = 'unChatId';
  const passageId = 123456;
  const userId = 456789;
  const message = 'message entrée';

  beforeEach(function () {
    llmApi = {
      prompt: sinon.stub(),
    };
    passageRepository = {
      get: sinon.stub(),
    };
    llmApi.prompt.throws(new Error('llmapi-prompt: Unexpected call'));
    passageRepository.get.throws(new Error('passageRepository-get: Unexpected call'));
  });

  context('when passage does not belong to user', function () {
    it('should throw a DomainError', async function () {
      // given
      passageRepository.get.withArgs({ passageId }).resolves(
        new Passage({
          id: passageId,
          userId: userId + 1,
        }),
      );

      // when
      const err = await catchErr(promptToLLMChat)({ chatId, passageId, userId, message, llmApi, passageRepository });

      // then
      expect(err).to.be.instanceOf(DomainError);
      expect(err.message).to.equal('This passage does not belong to user');
    });
  });

  context('when message response cannot be retrieved', function () {
    it('should throw a DomainError', async function () {
      // given
      passageRepository.get.withArgs({ passageId }).resolves(
        new Passage({
          id: passageId,
          userId,
        }),
      );
      llmApi.prompt.withArgs({ chatId, message }).resolves(null);

      // when
      const err = await catchErr(promptToLLMChat)({ chatId, passageId, userId, message, llmApi, passageRepository });

      // then
      expect(err).to.be.instanceOf(DomainError);
      expect(err.message).to.equal('Error when prompting in chat with LLM');
    });
  });

  context('success case', function () {
    it('should return llm response message', async function () {
      // given
      passageRepository.get.withArgs({ passageId }).resolves(
        new Passage({
          id: passageId,
          userId,
        }),
      );
      llmApi.prompt.withArgs({ chatId, message }).resolves(
        new LLMChatResponseDTO({
          message: 'message du llm',
        }),
      );

      // when
      const llmResponse = await promptToLLMChat({ chatId, passageId, userId, message, llmApi, passageRepository });

      // then
      expect(llmResponse).to.equal('message du llm');
    });
  });
});
