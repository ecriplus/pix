// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class CandidateEndScreenEvent extends TimelineEvent {
  /**
   * @param {object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: CandidateEndScreenEvent.name, when });
  }
}
