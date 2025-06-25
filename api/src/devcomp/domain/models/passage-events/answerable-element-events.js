import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { PassageEventWithElement } from './PassageEventWithElement.js';

class QCUDeclarativeAnsweredEvent extends PassageEventWithElement {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId, answer }) {
    super({
      type: 'QCU_DECLARATIVE_ANSWERED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      elementId,
      data: { answer },
    });

    assertNotNullOrUndefined(answer, 'The answer is required for a QCUDeclarativeAnsweredEvent');
  }
}

export { QCUDeclarativeAnsweredEvent };
