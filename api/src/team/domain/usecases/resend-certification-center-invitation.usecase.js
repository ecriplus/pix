const resendCertificationCenterInvitation = async function ({
  certificationCenterInvitationId,
  certificationCenterRepository,
  certificationCenterInvitationRepository,
  certificationCenterInvitationService,
}) {
  const certificationCenterInvitation = await certificationCenterInvitationRepository.get(
    certificationCenterInvitationId,
  );
  const certificationCenter = await certificationCenterRepository.get({
    id: certificationCenterInvitation.certificationCenterId,
  });
  await certificationCenterInvitationService.resendCertificationCenterInvitation({
    certificationCenterInvitationRepository,
  })({
    certificationCenter,
    certificationCenterInvitation,
  });

  return certificationCenterInvitationRepository.get(certificationCenterInvitationId);
};

export { resendCertificationCenterInvitation };
