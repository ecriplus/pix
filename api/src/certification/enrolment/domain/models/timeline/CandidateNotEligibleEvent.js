// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class CandidateNotEligibleEvent extends TimelineEvent {
  /**
   * @param {Object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: CandidateNotEligibleEvent.name, when });
  }
}
