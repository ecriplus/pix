import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';

const findCampaignParticipationsForUserManagement = withTransaction(async function ({
  userId,
  participationsForUserManagementRepository,
}) {
  return participationsForUserManagementRepository.findByUserId(userId);
});

export { findCampaignParticipationsForUserManagement };
