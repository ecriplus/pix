import { DomainError } from '../../../../shared/domain/errors.js';
import { assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { PassageEventInstantiationError } from '../../errors.js';

/**
 * @abstract PassageEvent
 * After the write operation is successful, the system generates events that describe what changed (like "Passage started" or "Video started").
 * These events serve as notifications about the updates.
 * See Event sourcing pattern for more information.
 * https://martinfowler.com/eaaDev/EventSourcing.html
 *
 * This is the base class for all PassageEvents. Subclasses should be named in past tense.
 */
class PassageEvent {
  constructor({ id, type, occurredAt, createdAt, passageId, sequenceNumber, data } = {}) {
    if (this.constructor === PassageEvent) {
      throw new PassageEventInstantiationError();
    }

    assertNotNullOrUndefined(type, 'The type is required for a PassageEvent');
    assertNotNullOrUndefined(occurredAt, 'The occurredAt is required for a PassageEvent');
    assertNotNullOrUndefined(passageId, 'The passageId is required for a PassageEvent');
    assertNotNullOrUndefined(sequenceNumber, 'The sequenceNumber is required for a PassageEvent');

    this.id = id;
    this.type = type;
    this.setOccurredAt(occurredAt);
    this.createdAt = createdAt;
    this.setPassageId(passageId);
    this.data = data;
    this.setSequenceNumber(sequenceNumber);
  }

  setPassageId(passageId) {
    if (typeof passageId !== 'number') {
      throw new DomainError('The passageId should be a number');
    }

    this.passageId = passageId;
  }

  setOccurredAt(occurredAt) {
    if (Object.prototype.toString.call(occurredAt) !== '[object Date]') {
      throw new DomainError('The occurredAt property should be a Date object');
    }

    this.occurredAt = occurredAt;
  }

  setSequenceNumber(sequenceNumber) {
    if (typeof sequenceNumber !== 'number') {
      throw new DomainError('The sequenceNumber should be a number');
    }
    if (sequenceNumber < 1) {
      throw new DomainError('The sequenceNumber should be a number higher than 0');
    }

    this.sequenceNumber = sequenceNumber;
  }
}

export { PassageEvent };
