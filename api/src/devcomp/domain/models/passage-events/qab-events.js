import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { PassageEventWithElement } from './PassageEventWithElement.js';
import { PassageEventWithElementAnswered } from './PassageEventWithElementAnswered.js';

class QABCardAnsweredEvent extends PassageEventWithElementAnswered {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId, cardId, answer, status }) {
    super({
      type: 'QAB_CARD_ANSWERED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      elementId,
      answer,
      status,
      data: { cardId },
    });

    assertNotNullOrUndefined(cardId, 'The cardId is required for a QABCardAnsweredEvent');
  }
}

class QABCardRetriedEvent extends PassageEventWithElement {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId }) {
    super({ id, type: 'QAB_CARD_RETRIED', occurredAt, createdAt, passageId, sequenceNumber, elementId });
  }
}

export { QABCardAnsweredEvent, QABCardRetriedEvent };
