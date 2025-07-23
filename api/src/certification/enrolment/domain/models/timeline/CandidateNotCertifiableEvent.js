// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class CandidateNotCertifiableEvent extends TimelineEvent {
  /**
   * @param {Object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: CandidateNotCertifiableEvent.name, when });
  }
}
