// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class LastAnsweredEvent extends TimelineEvent {
  /**
   * @param {object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: LastAnsweredEvent.name, when });
  }
}
