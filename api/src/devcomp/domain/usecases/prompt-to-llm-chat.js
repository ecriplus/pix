import { DomainError } from '../../../shared/domain/errors.js';

export async function promptToLLMChat({ userId, passageId, chatId, prompt, llmApi, passageRepository }) {
  await checkIfPassageBelongsToUser(passageId, userId, passageRepository);
  const llmChatResponseDTO = await llmApi.prompt({ chatId, message: prompt });
  if (!llmChatResponseDTO) {
    throw new DomainError('Error when prompting in chat with LLM');
  }
  return llmChatResponseDTO.message;
}

async function checkIfPassageBelongsToUser(passageId, userId, passageRepository) {
  const passage = await passageRepository.get({ passageId });
  if (passage.userId !== userId) throw new DomainError(`This passage does not belong to user`);
}
