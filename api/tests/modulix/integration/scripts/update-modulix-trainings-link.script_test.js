import { UpdateModulixTrainingsLink } from '../../../../scripts/modulix/update-modulix-trainings-link.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('integration | modulix | scripts | UpdateModulixTrainingsLink', function () {
  describe('#handle', function () {
    let file;
    let script;
    let logger;
    let clock;
    let now;

    beforeEach(function () {
      now = new Date('2025-10-10');
      clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
      script = new UpdateModulixTrainingsLink();
      logger = { info: sinon.spy() };
    });

    afterEach(function () {
      clock.restore();
    });

    it('runs the script with dryRun', async function () {
      // given
      databaseBuilder.factory.buildTraining({
        id: 1,
        link: `https://app.pix.fr/modules/tmp-prompt-intermediaire`,
        updatedAt: new Date('2020-09-10'),
        type: 'modulix',
      });
      await databaseBuilder.commit();

      // when
      await script.handle({
        options: { file, dryRun: true },
        logger,
      });

      // then
      expect(logger.info).to.have.been.calledWith('1 training(s) should have been updated');

      expect(logger.info).to.have.been.calledWith(
        'Training link after update : https://app.pix.fr/modules/4eacd0c3/tmp-prompt-intermediaire',
      );

      const trainings = await knex('trainings').orderBy('id');

      expect(trainings[0].link).to.equal('https://app.pix.fr/modules/tmp-prompt-intermediaire');
      expect(trainings[0].updatedAt).to.deep.equal(new Date('2020-09-10'));
    });

    it('update modulix trainings link', async function () {
      // given
      databaseBuilder.factory.buildTraining({
        id: 1,
        link: `https://app.pix.fr/modules/tmp-prompt-intermediaire`,
        updatedAt: new Date('2020-09-10'),
        type: 'modulix',
      });
      databaseBuilder.factory.buildTraining({
        id: 2,
        link: `https://app.pix.fr/modules/bac-a-sable/details`,
        updatedAt: new Date('2021-10-10'),
        type: 'modulix',
      });
      databaseBuilder.factory.buildTraining({
        id: 3,
        link: 'https://app.pix.fr/campagnes/SJKQSDHQD',
        updatedAt: new Date('2022-10-10'),
        type: 'modulix',
      });
      databaseBuilder.factory.buildTraining({
        id: 4,
        link: 'https://app.pix.fr/modules/galerie',
        updatedAt: new Date('2023-10-10'),
        type: 'webinaire',
      });
      await databaseBuilder.commit();

      // when
      await script.handle({
        options: { file },
        logger,
      });

      // then
      const trainings = await knex('trainings').orderBy('id');

      expect(trainings[0].link).to.equal('https://app.pix.fr/modules/4eacd0c3/tmp-prompt-intermediaire');
      expect(trainings[0].updatedAt).to.deep.equal(now);

      expect(trainings[1].link).to.equal('https://app.pix.fr/modules/6a68bf32/bac-a-sable/details');
      expect(trainings[1].updatedAt).to.deep.equal(now);

      expect(trainings[2].link).to.equal('https://app.pix.fr/campagnes/SJKQSDHQD');
      expect(trainings[2].updatedAt).to.deep.equal(new Date('2022-10-10'));

      expect(trainings[3].link).to.equal('https://app.pix.fr/modules/galerie');
      expect(trainings[3].updatedAt).to.deep.equal(new Date('2023-10-10'));
    });
  });
});
