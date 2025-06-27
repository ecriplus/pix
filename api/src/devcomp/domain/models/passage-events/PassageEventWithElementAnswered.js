import { assertEnumValue, assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { PassageEventWithElementAnsweredInstantiationError } from '../../errors.js';
import { PassageEventWithElement } from './PassageEventWithElement.js';

const StatusEnumValues = Object.freeze({
  OK: 'ok',
  KO: 'ko',
});

/**
 * @abstract PassageEventWithElementAnswered
 * See PassageEventWithElement for more info.
 *
 * This is the base class for all PassageEventWithElementAnswered.
 * It's syntaxic sugar for a `PassageEvent` that contains an element answerable which send an event with the answer
 * It exists because we have a lot of answerable element and that we store its answer and status in the `data` key...
 * Subclasses should be named in past tense.
 */
class PassageEventWithElementAnswered extends PassageEventWithElement {
  constructor({ id, type, occurredAt, createdAt, passageId, sequenceNumber, elementId, answer, status, data } = {}) {
    super({ id, type, occurredAt, createdAt, passageId, sequenceNumber, elementId, data: { ...data, answer, status } });

    if (this.constructor === PassageEventWithElementAnswered) {
      throw new PassageEventWithElementAnsweredInstantiationError();
    }

    assertNotNullOrUndefined(answer, 'The answer property is required for a PassageEventWithElementAnswered');
    assertNotNullOrUndefined(status, 'The status property is required for a PassageEventWithElementAnswered');
    assertEnumValue(StatusEnumValues, status, 'The status value must be one of these : [‘ok‘, ‘ko‘]');
  }
}

export { PassageEventWithElementAnswered };
