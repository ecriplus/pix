import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { PassageEventWithElement } from './PassageEventWithElement.js';
import { PassageEventWithElementAnswered } from './PassageEventWithElementAnswered.js';

class EmbedAnsweredEvent extends PassageEventWithElementAnswered {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId, answer, status }) {
    super({
      type: 'EMBED_ANSWERED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      elementId,
      answer,
      status,
    });
  }
}

class QCMAnsweredEvent extends PassageEventWithElement {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId, answer }) {
    super({
      type: 'QCM_ANSWERED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      elementId,
      data: { answer },
    });

    assertNotNullOrUndefined(answer, 'The answer is required for a QCMAnsweredEvent');
  }
}

class QCUAnsweredEvent extends PassageEventWithElementAnswered {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId, answer, status }) {
    super({
      type: 'QCU_ANSWERED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      elementId,
      answer,
      status,
    });
  }
}

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

export { EmbedAnsweredEvent, QCUAnsweredEvent, QCUDeclarativeAnsweredEvent };
