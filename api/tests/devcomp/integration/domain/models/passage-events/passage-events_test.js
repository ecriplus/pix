import { PassageTerminatedEvent } from '../../../../../../src/devcomp/domain/models/passage-events/passage-events.js';
import { expect } from '../../../../../test-helper.js';

describe('Integration | Devcomp | Domain | Models | passage-events | passage-events', function () {
  describe('#PassageTerminatedEvent', function () {
    it('should init and keep attributes', function () {
      // given
      const id = Symbol('id');
      const occurredAt = Symbol('date');
      const createdAt = Symbol('date');
      const passageId = Symbol('passage');

      // when
      const passageTerminatedEvent = new PassageTerminatedEvent({ id, occurredAt, createdAt, passageId });

      // then
      expect(passageTerminatedEvent.id).to.equal(id);
      expect(passageTerminatedEvent.type).to.equal('PASSAGE_TERMINATED');
      expect(passageTerminatedEvent.occurredAt).to.equal(occurredAt);
      expect(passageTerminatedEvent.createdAt).to.equal(createdAt);
      expect(passageTerminatedEvent.passageId).to.equal(passageId);
      expect(passageTerminatedEvent.data).to.be.undefined;
    });
  });
});
