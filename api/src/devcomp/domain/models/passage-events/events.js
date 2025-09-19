import { PassageEventWithElement } from './PassageEventWithElement.js';

/**
 * @class ExpandOpenedEvent
 * See PassageEventWithElement for more info.
 *
 * This event is generated when the user opens a fold-out text.
 *
 * */
class ExpandOpenedEvent extends PassageEventWithElement {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId }) {
    super({
      type: 'EXPAND_OPENED',
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

/**
 * @class VideoPlayedEvent
 * See PassageEventWithElement for more info.
 *
 * This event is generated when the user plays a video.
 *
 * */
class VideoPlayedEvent extends PassageEventWithElement {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId }) {
    super({
      type: 'VIDEO_PLAYED',
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
 * @class FileDownloadedEvent
 * See PassageEventWithElement for more info.
 *
 * This event is generated when the user downloads a file.
 * */
class FileDownloadedEvent extends PassageEventWithElement {
  constructor({ id, occurredAt, createdAt, passageId, sequenceNumber, elementId, filename, format }) {
    super({
      type: 'FILE_DOWNLOADED',
      id,
      occurredAt,
      createdAt,
      passageId,
      sequenceNumber,
      elementId,
      data: { filename, format },
    });
  }
}

export {
  ExpandOpenedEvent,
  FileDownloadedEvent,
  ImageAlternativeTextOpenedEvent,
  VideoPlayedEvent,
  VideoTranscriptionOpenedEvent,
};
