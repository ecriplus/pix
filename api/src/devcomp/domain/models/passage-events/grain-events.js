import { assertHasUuidLength, assertNotNullOrUndefined } from '../../../../shared/domain/models/asserts.js';
import { PassageEvent } from './PassageEvent.js';

class GrainContinuedEvent extends PassageEvent {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, grainId }) {
    super({
      type: 'GRAIN_CONTINUED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      data: { grainId },
    });

    assertNotNullOrUndefined(grainId, 'The grainId property is required for a GrainContinuedEvent');
    assertHasUuidLength(grainId, 'The grainId property should be exactly 36 characters long');
  }
}

export { GrainContinuedEvent };
