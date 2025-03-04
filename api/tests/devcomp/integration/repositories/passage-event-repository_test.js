import { PassageStartedEvent } from '../../../../src/devcomp/domain/models/passage-events/passage-events.js';
import * as passageEventRepository from '../../../../src/devcomp/infrastructure/repositories/passage-event-repository.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | DevComp | Repositories | PassageEventRepository', function () {
  describe('#record', function () {
    let clock;

    beforeEach(function () {
      clock = sinon.useFakeTimers(new Date('2023-12-31'), 'Date');
    });

    afterEach(function () {
      clock.restore();
    });

    it('should record a passage event', async function () {
      // given
      const passage = databaseBuilder.factory.buildPassage();
      await databaseBuilder.commit();
      const event = new PassageStartedEvent({
        occurredAt: new Date('2019-04-28'),
        passageId: passage.id,
        contentHash: 'abcd1234',
      });

      // when
      await passageEventRepository.record(event);

      // then
      const recordedEvent = await knex('passage-events')
        .where({ type: 'PASSAGE_STARTED', passageId: passage.id })
        .first();
      expect(recordedEvent.data.contentHash).to.equal('abcd1234');
      expect(recordedEvent.occurredAt).to.deep.equal(new Date('2019-04-28'));
    });
  });
});
