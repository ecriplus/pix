import { DomainError } from '../../../shared/domain/errors.js';

export class InvalidScoWhitelistError extends DomainError {
  constructor(meta) {
    super('La liste blanche contient des données invalides.', 'CERTIFICATION_INVALID_SCO_WHITELIST_ERROR', meta);
  }
}
