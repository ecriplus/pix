import {
  assertHasUuidLength,
  assertNotNullOrUndefined,
  assertPositiveInteger,
} from '../../../../shared/domain/models/asserts.js';
import { PassageEvent } from './PassageEvent.js';

class StepperNextStepEvent extends PassageEvent {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, grainId, stepNumber }) {
    super({
      type: 'STEPPER_NEXT_STEP',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      data: { grainId, stepNumber },
    });

    assertNotNullOrUndefined(grainId, 'The grainId property is required for a StepperNextStepEvent');
    assertHasUuidLength(grainId, 'The grainId property should be exactly 36 characters long');
    assertNotNullOrUndefined(stepNumber, 'The stepNumber property is required for a StepperNextStepEvent');
    assertPositiveInteger(stepNumber, 'The stepNumber property must be a positive integer');
  }
}

export { StepperNextStepEvent };
