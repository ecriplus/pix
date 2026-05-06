const endAssessmentByInvigilator = async function ({ certificationCandidateId, certificationAssessmentRepository }) {
  const certificationAssessment = await certificationAssessmentRepository.getByCertificationCandidateId({
    certificationCandidateId,
  });

  if (certificationAssessment.isCompleted()) {
    return;
  }

  certificationAssessment.endByInvigilator();
  await certificationAssessmentRepository.save(certificationAssessment);
};

export { endAssessmentByInvigilator };
