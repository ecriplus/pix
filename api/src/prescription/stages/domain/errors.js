import { DomainError } from '../../../shared/domain/errors.js';

class InvalidStageError extends DomainError {
  constructor(message) {
    super(message);
  }
}

class StageWithLinkedCampaignError extends DomainError {
  constructor() {
    super('The stage is part of a target profile linked to a campaign');
  }
}

class StageModificationForbiddenForLinkedTargetProfileError extends DomainError {
  constructor(targetProfileId) {
    super(
      `Le profil cible ${targetProfileId} est déjà rattaché à une campagne. La modification du seuil ou niveau est alors impossible.`,
    );
  }
}

export { InvalidStageError, StageModificationForbiddenForLinkedTargetProfileError, StageWithLinkedCampaignError };
