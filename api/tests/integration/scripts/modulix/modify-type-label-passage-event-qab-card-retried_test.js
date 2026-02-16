import { ModifyTypeLabelPassageEventQabCardRetried } from '../../../../scripts/modulix/modify-type-label-passage-event-qab-card-retried.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

const OLD_TYPE_LABEL = 'QAB_CARD_RETRIED';
const NEW_LABEL_TYPE = 'QAB_RETRIED';

describe('Integration | modulix | scripts | modify-type-label-passage-event-qab-card-retried.js', function () {
  describe('#handle', function () {
    let file;
    let logger;
    let script;

    beforeEach(function () {
      script = new ModifyTypeLabelPassageEventQabCardRetried();
      logger = { info: sinon.spy(), error: sinon.spy() };
    });

    it('runs the script with dryRun', async function () {
      // given
      const passage = databaseBuilder.factory.buildPassage();
      databaseBuilder.factory.buildPassageEvent({
        type: `${OLD_TYPE_LABEL}`,
        passageId: passage.id,
        sequenceNumber: 1,
      });
      databaseBuilder.factory.buildPassageEvent({
        type: `${OLD_TYPE_LABEL}`,
        passageId: passage.id,
        sequenceNumber: 2,
      });
      databaseBuilder.factory.buildPassageEvent({
        type: 'PASSAGE_TERMINATED',
        passageId: passage.id,
        sequenceNumber: 3,
      });
      await databaseBuilder.commit();

      // when
      await script.handle({
        options: { file, dryRun: true },
        logger,
      });

      // then
      expect(logger.info).to.have.been.calledWith(
        'List of passage events with old type label ‘QAB_CARD_RETRIED‘ left after update : ',
      );
      const passageEvents = await knex('passage-events').orderBy('id');
      expect(passageEvents[0].type).to.equal(OLD_TYPE_LABEL);
      expect(passageEvents[1].type).to.equal(OLD_TYPE_LABEL);
      expect(passageEvents[2].type).to.equal('PASSAGE_TERMINATED');
    });

    it('runs the script without dryRun', async function () {
      // given
      const passage = databaseBuilder.factory.buildPassage();
      databaseBuilder.factory.buildPassageEvent({
        type: `${OLD_TYPE_LABEL}`,
        passageId: passage.id,
        sequenceNumber: 1,
      });
      databaseBuilder.factory.buildPassageEvent({
        type: `${OLD_TYPE_LABEL}`,
        passageId: passage.id,
        sequenceNumber: 2,
      });
      databaseBuilder.factory.buildPassageEvent({
        type: 'PASSAGE_TERMINATED',
        passageId: passage.id,
        sequenceNumber: 3,
      });
      await databaseBuilder.commit();

      // when
      await script.handle({
        options: { file },
        logger,
      });

      // then
      const passageEvents = await knex('passage-events').orderBy('id');
      expect(passageEvents[0].type).to.equal(NEW_LABEL_TYPE);
      expect(passageEvents[1].type).to.equal(NEW_LABEL_TYPE);
      expect(passageEvents[2].type).to.equal('PASSAGE_TERMINATED');

      expect(logger.info).to.have.been.calledWith('Number of passage event with the old type QAB_CARD_RETRIED : 2');
    });
  });
});
