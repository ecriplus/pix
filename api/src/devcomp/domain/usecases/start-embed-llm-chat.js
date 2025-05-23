import { DomainError } from '../../../shared/domain/errors.js';

export async function startEmbedLlmChat({ configId, userId, passageId, llmApi, passageRepository }) {
  await checkIfPassageBelongsToUser(passageId, userId, passageRepository);
  const newChat = await llmApi.startChat({ configId, prefixIdentifier: `p${passageId}` });
  if (!newChat) {
    throw new DomainError('Error when starting chat with LLM');
  }
  return newChat;
}

async function checkIfPassageBelongsToUser(passageId, userId, passageRepository) {
  const passage = await passageRepository.get({ passageId });
  if (passage.userId !== userId) throw new DomainError(`This passage does not belong to user`);
}
