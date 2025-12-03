// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class CandidateCertifiableAndEligibleEvent extends TimelineEvent {
  /**
   * @param {Object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: CandidateCertifiableAndEligibleEvent.name, when });
  }
}
