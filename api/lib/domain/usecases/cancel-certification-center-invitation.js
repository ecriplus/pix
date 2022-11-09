const { UncancellableCertificationCenterInvitationError } = require('../../domain/errors');

module.exports = async function cancelCertificationCenterInvitationInvitation({
  certificationCenterInvitationId,
  certificationCenterInvitationRepository,
}) {
  const foundCertificationCenterInvitation = await certificationCenterInvitationRepository.get(
    certificationCenterInvitationId
  );

  if (!foundCertificationCenterInvitation.isPending) {
    throw new UncancellableCertificationCenterInvitationError();
  }

  return await certificationCenterInvitationRepository.markAsCancelled({ id: certificationCenterInvitationId });
};
