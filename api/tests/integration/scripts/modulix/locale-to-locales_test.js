import { LocaleToLocalesScript } from '../../../../scripts/modulix/locale-to-locales.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Integration | Modulix | scripts | locale-to-locales.js', function () {
  describe('#handle', function () {
    let logger;
    let script;

    beforeEach(function () {
      script = new LocaleToLocalesScript();
      logger = { info: sinon.spy() };
    });

    it('runs the script with dryRun', async function () {
      // given
      databaseBuilder.factory.buildTraining({ locale: 'fr', locales: [] });
      databaseBuilder.factory.buildTraining({ locale: 'fr-fr', locales: [] });
      databaseBuilder.factory.buildTraining({ locale: 'en', locales: [] });
      await databaseBuilder.commit();

      // when
      await script.handle({ options: { dryRun: true }, logger });

      // then
      const trainings = await knex('trainings').select('locales').orderBy('id');
      expect(trainings[0].locales).to.deep.equal([]);
      expect(trainings[1].locales).to.deep.equal([]);
      expect(trainings[2].locales).to.deep.equal([]);
      expect(logger.info).to.have.been.calledWith('Dry run: 3 trainings would have been updated');
    });

    it('runs the script without dryRun', async function () {
      // given
      databaseBuilder.factory.buildTraining({ locale: 'fr', locales: [] });
      databaseBuilder.factory.buildTraining({ locale: 'fr-fr', locales: [] });
      databaseBuilder.factory.buildTraining({ locale: 'en', locales: [] });
      await databaseBuilder.commit();

      // when
      await script.handle({ options: { dryRun: false }, logger });

      // then
      const trainings = await knex('trainings').select('locales').orderBy('id');
      expect(trainings[0].locales).to.deep.equal(['fr']);
      expect(trainings[1].locales).to.deep.equal(['fr-fr']);
      expect(trainings[2].locales).to.deep.equal(['en']);
      expect(logger.info).to.have.been.calledWith('3 trainings have been successfully updated');
    });
  });
});
