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

class QCMAnsweredEvent extends PassageEventWithElementAnswered {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId, answer, status }) {
    super({
      type: 'QCM_ANSWERED',
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

class QCMRetriedEvent extends PassageEventWithElement {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId }) {
    super({
      type: 'QCM_RETRIED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      elementId,
    });
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

class QCURetriedEvent extends PassageEventWithElement {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId }) {
    super({
      type: 'QCU_RETRIED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      elementId,
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

class QCUDiscoveryAnsweredEvent extends PassageEventWithElementAnswered {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId, answer, status }) {
    super({
      type: 'QCU_DISCOVERY_ANSWERED',
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

class QROCMAnsweredEvent extends PassageEventWithElementAnswered {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId, answer, status }) {
    super({
      type: 'QROCM_ANSWERED',
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

export {
  EmbedAnsweredEvent,
  QCMAnsweredEvent,
  QCMRetriedEvent,
  QCUAnsweredEvent,
  QCUDeclarativeAnsweredEvent,
  QCUDiscoveryAnsweredEvent,
  QCURetriedEvent,
  QROCMAnsweredEvent,
};
