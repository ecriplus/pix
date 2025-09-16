import { PassageEventWithElement } from './PassageEventWithElement.js';

/**
 * @class ImageAlternativeTextOpenedEvent
 * See PassageEventWithElement for more info.
 *
 * This event is generated when the user opens the alternative text of an image.
 *
 * */
class ImageAlternativeTextOpenedEvent extends PassageEventWithElement {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId }) {
    super({
      type: 'IMAGE_ALTERNATIVE_TEXT_OPENED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      elementId,
    });
  }
}

export { ImageAlternativeTextOpenedEvent };
