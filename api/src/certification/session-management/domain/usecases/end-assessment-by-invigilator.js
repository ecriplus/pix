const endAssessmentByInvigilator = async function ({ certificationCandidateId, certificationAssessmentRepository }) {
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCandidateId({
    certificationCandidateId,
  });

  if (certificationAssessment.isCompleted()) {
    return;
  }

  certificationAssessment.endByInvigilator({ now: new Date() });
  await certificationAssessmentRepository.save(certificationAssessment);
};

export { endAssessmentByInvigilator };
