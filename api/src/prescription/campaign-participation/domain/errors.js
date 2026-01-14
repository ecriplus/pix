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

export { CampaignParticipationDeletedError, CantCalculateCampaignParticipationResultError };
