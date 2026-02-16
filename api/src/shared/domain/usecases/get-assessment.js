export async function getAssessment({ assessmentId, assessmentRepository }) {
  return await assessmentRepository.getWithAnswers(assessmentId);
}
