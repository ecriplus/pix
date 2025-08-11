import { DomainError } from '../../../shared/domain/errors.js';

export async function startEmbedLlmChat({ configId, userId, assessmentId, llmApi, assessmentRepository }) {
  await checkIfAssessmentBelongsToUser(assessmentId, userId, assessmentRepository);
  return await llmApi.startChat({ configId, userId, assessmentId });
}

async function checkIfAssessmentBelongsToUser(assessmentId, userId, assessmentRepository) {
  const assessment = await assessmentRepository.get(assessmentId);
  if (assessment.userId !== userId) throw new DomainError(`This assessment does not belong to user`);
}
