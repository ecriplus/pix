// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class CandidateNotEligibleEvent extends TimelineEvent {
  /**
   * @param {object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: CandidateNotEligibleEvent.name, when });
  }
}
