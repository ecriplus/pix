import { DomainError } from '../../../shared/domain/errors.js';

export class MultipleQuestFoundError extends DomainError {
  constructor({ campaignId }) {
    super(`Found multiple quests using campaignId ${campaignId}`, 'MULTIPLE_QUEST_FOUND');
  }
}
