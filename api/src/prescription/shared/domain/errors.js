import { DomainError } from '../../../shared/domain/errors.js';

export class ArchivedCampaignError extends DomainError {
  constructor(message = 'Cette campagne est déjà archivée.') {
    super(message);
  }
}
