// @ts-check
import { TimelineEvent } from './TimelineEvent.js';

export class LastAnswerEvent extends TimelineEvent {
  /**
   * @param {object} props
   * @param {Date} props.when
   */
  constructor({ when }) {
    super({ code: LastAnswerEvent.name, when });
  }
}
