import { DomainError } from '../../../shared/domain/errors.js';

export async function promptToLLMChat({ userId, assessmentId, chatId, prompt, llmApi, assessmentRepository }) {
  await checkIfAssessmentBelongsToUser(assessmentId, userId, assessmentRepository);
  return llmApi.prompt({ chatId, userId, message: prompt });
}

async function checkIfAssessmentBelongsToUser(assessmentId, userId, assessmentRepository) {
  const assessment = await assessmentRepository.get(assessmentId);
  if (assessment.userId !== userId) throw new DomainError(`This assessment does not belong to user`);
}
