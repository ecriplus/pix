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

/**
 * @class VideoTranscriptionOpenedEvent
 * See PassageEventWithElement for more info.
 *
 * This event is generated when the user opens the transcription of a video.
 *
 * */
class VideoTranscriptionOpenedEvent extends PassageEventWithElement {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId }) {
    super({
      type: 'VIDEO_TRANSCRIPTION_OPENED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      elementId,
    });
  }
}

export { ImageAlternativeTextOpenedEvent, VideoTranscriptionOpenedEvent };
