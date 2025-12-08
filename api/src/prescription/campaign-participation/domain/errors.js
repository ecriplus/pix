import { DomainError } from '../../../shared/domain/errors.js';

class CampaignParticipationDeletedError extends DomainError {
  constructor(message = 'La participation est supprimée.') {
    super(message);
  }
}

class CantCalculateCampaignParticipationResultError extends DomainError {
  constructor(message = `Impossible de calculer le résultat de la participation car elle n'a pas été partagée.`) {
    super(message);
  }
}

class CampaignParticipationInvalidStatus extends DomainError {
  constructor(campaignParticipationId, acceptedStatus) {
    super(
      `Campaign participation: ${campaignParticipationId} status do not fulfill requirement. Accepted Status : ${acceptedStatus}`,
    );
  }
}

export {
  CampaignParticipationDeletedError,
  CampaignParticipationInvalidStatus,
  CantCalculateCampaignParticipationResultError,
};
