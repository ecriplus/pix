import { ShortVideoTranscriptionOpenedEvent } from '../../../../../../src/devcomp/domain/models/passage-events/events.js';
import { expect } from '../../../../../test-helper.js';

describe('Integration | Devcomp | Domain | Models | passage-events | events', function () {
  describe('#ShortVideoTranscriptionOpenedEvent', function () {
    it('should init and keep attributes', function () {
      // given
      const id = Symbol('id');
      const occurredAt = new Date();
      const createdAt = Symbol('date');
      const passageId = 1234;
      const sequenceNumber = 2;
      const elementId = 'f46f8a14-a4d2-400a-95a3-2c8033b30f4e';

      // when
      const event = new ShortVideoTranscriptionOpenedEvent({
        id,
        occurredAt,
        createdAt,
        passageId,
        sequenceNumber,
        elementId,
      });

      // then
      expect(event.id).to.equal(id);
      expect(event.type).to.equal('SHORT_VIDEO_TRANSCRIPTION_OPENED');
      expect(event.occurredAt).to.equal(occurredAt);
      expect(event.createdAt).to.equal(createdAt);
      expect(event.passageId).to.equal(passageId);
      expect(event.data).to.deep.equal({ elementId });
    });
  });
});
