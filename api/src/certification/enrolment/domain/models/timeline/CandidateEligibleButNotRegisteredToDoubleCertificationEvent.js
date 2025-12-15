// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class CandidateEligibleButNotRegisteredToDoubleCertificationEvent extends TimelineEvent {
  /**
   * @param {Object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: CandidateEligibleButNotRegisteredToDoubleCertificationEvent.name, when });
  }
}
