// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class CandidateReconciledEvent extends TimelineEvent {
  /**
   * @param {object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: CandidateReconciledEvent.name, when });
  }
}
