import { Assessment } from '../../../../../src/shared/domain/models/index.js';
import { promptToLLMChat } from '../../../../../src/evaluation/domain/usecases/prompt-to-llm-chat.js';
import { DomainError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, expect, sinon } from '../../../../test-helper.js';

describe('Unit | Eval | Domain | UseCases | prompt-to-llm-chat', function () {
  let llmApi, assessmentRepository;
  const chatId = 'unChatId';
  const assessmentId = 123456;
  const userId = 456789;
  const prompt = 'message entrée';

  beforeEach(function () {
    llmApi = {
      prompt: sinon.stub(),
    };
    assessmentRepository = {
      get: sinon.stub(),
    };
    llmApi.prompt.throws(new Error('llmapi-prompt: Unexpected call'));
    assessmentRepository.get.throws(new Error('assessmentRepository-get: Unexpected call'));
  });

  context('when passage does not belong to user', function () {
    it('should throw a DomainError', async function () {
      // given
      assessmentRepository.get.withArgs(assessmentId).resolves(
        new Assessment({
          id: assessmentId,
          userId: userId + 1,
        }),
      );

      // when
      const err = await catchErr(promptToLLMChat)({ chatId, assessmentId, userId, prompt, llmApi, assessmentRepository: assessmentRepository });

      // then
      expect(err).to.be.instanceOf(DomainError);
      expect(err.message).to.equal('This assessment does not belong to user');
    });
  });

  context('success case', function () {
    it('should return the stream', async function () {
      // given
      assessmentRepository.get.withArgs(assessmentId).resolves(
        new Assessment({
          id: assessmentId,
          userId,
        }),
      );
      const stream = Symbol('le stream de réponse du LLM');
      llmApi.prompt.withArgs({ chatId, userId, message: prompt }).resolves(stream);

      // when
      const actualStream = await promptToLLMChat({ chatId, assessmentId, userId, prompt, llmApi, assessmentRepository: assessmentRepository });

      // then
      expect(actualStream).to.deep.equal(stream);
    });
  });
});
