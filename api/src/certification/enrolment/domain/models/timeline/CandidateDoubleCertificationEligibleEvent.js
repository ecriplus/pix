// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class CandidateDoubleCertificationEligibleEvent extends TimelineEvent {
  /**
   * @param {Object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: CandidateDoubleCertificationEligibleEvent.name, when });
  }
}
