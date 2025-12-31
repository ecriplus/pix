// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class CertificationStartedEvent extends TimelineEvent {
  /**
   * @param {object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: CertificationStartedEvent.name, when });
  }
}
