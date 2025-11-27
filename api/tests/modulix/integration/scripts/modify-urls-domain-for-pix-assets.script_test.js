import { ModifyBadgeAndTrainingLogoUrlsDomain } from '../../../../scripts/modulix/modify-urls-domain-for-pix-assets.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

const OLD_DOMAIN = 'images.pix.fr';
const NEW_DOMAIN = 'assets.pix.org';

describe('integration | modulix | scripts | modify-urls-domain-for-pix-assets', function () {
  describe('#handle', function () {
    let file;
    let script;
    let logger;
    let clock;
    let now;

    beforeEach(function () {
      now = new Date('2025-10-10');
      clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
      script = new ModifyBadgeAndTrainingLogoUrlsDomain();
      logger = { info: sinon.spy(), error: sinon.spy() };
    });

    afterEach(function () {
      clock.restore();
    });

    it('runs the script with dryRun', async function () {
      // given
      databaseBuilder.factory.buildTraining({
        id: 1,
        editorLogoUrl: `https://${OLD_DOMAIN}/contenu-formatif/editeur/url-updated.svg`,
        updatedAt: new Date('2020-09-10'),
      });
      databaseBuilder.factory.buildTraining({
        id: 2,
        editorLogoUrl: `https://${NEW_DOMAIN}/contenu-formatif/editeur/same-url.svg`,
        updatedAt: new Date('2022-04-10'),
      });
      databaseBuilder.factory.buildBadge({
        id: 1,
        imageUrl: `https://${OLD_DOMAIN}/badges/url-updated.svg`,
      });
      databaseBuilder.factory.buildBadge({
        id: 2,
        imageUrl: `https://${NEW_DOMAIN}/badges/same-url.svg`,
      });
      await databaseBuilder.commit();

      // when
      await script.handle({
        options: { file, dryRun: true },
        logger,
      });

      // then
      expect(logger.info).to.have.been.calledWith('Trainings list with old domain after update : ');
      expect(logger.info).to.have.been.calledWith('Badges list with old domain after update : ');

      const trainings = await knex('trainings').orderBy('id');
      expect(trainings[0].editorLogoUrl).to.equal(`https://${OLD_DOMAIN}/contenu-formatif/editeur/url-updated.svg`);
    });

    describe('For trainings editorLogoUrl', function () {
      it('modify the urls domain', async function () {
        // given
        databaseBuilder.factory.buildTraining({
          id: 1,
          editorLogoUrl: `https://${OLD_DOMAIN}/contenu-formatif/editeur/url-updated.svg`,
          updatedAt: new Date('2020-09-10'),
        });
        databaseBuilder.factory.buildTraining({
          id: 2,
          editorLogoUrl: `https://${NEW_DOMAIN}/contenu-formatif/editeur/same-url.svg`,
          updatedAt: new Date('2022-04-10'),
        });
        databaseBuilder.factory.buildTraining({
          id: 3,
          editorLogoUrl: `https://${OLD_DOMAIN}/contenu-formatif/editeur/autre-dossier-surprise/dave-comp-url-updated.svg`,
          updatedAt: new Date('2021-01-10'),
        });
        databaseBuilder.factory.buildTraining({
          id: 4,
          editorLogoUrl: `https://${OLD_DOMAIN}/contenu-formatif/https://${OLD_DOMAIN}/contenu-formatif/logo.svg`,
          updatedAt: new Date('2023-11-10'),
        });
        await databaseBuilder.commit();

        // when
        await script.handle({
          options: { file },
          logger,
        });

        // then
        const trainings = await knex('trainings').orderBy('id');
        expect(trainings[0].editorLogoUrl).to.equal(`https://${NEW_DOMAIN}/contenu-formatif/editeur/url-updated.svg`);
        expect(trainings[0].updatedAt).to.deep.equal(now);

        expect(trainings[1].editorLogoUrl).to.equal(`https://${NEW_DOMAIN}/contenu-formatif/editeur/same-url.svg`);
        expect(trainings[1].updatedAt).to.deep.equal(new Date('2022-04-10'));

        expect(trainings[2].editorLogoUrl).to.equal(
          `https://${NEW_DOMAIN}/contenu-formatif/editeur/autre-dossier-surprise/dave-comp-url-updated.svg`,
        );
        expect(trainings[2].updatedAt).to.deep.equal(now);

        expect(trainings[3].editorLogoUrl).to.equal(`https://${NEW_DOMAIN}/contenu-formatif/logo.svg`);
        expect(trainings[3].updatedAt).to.deep.equal(now);

        expect(logger.info).to.have.been.calledWith(
          'Number of trainings with a editorLogoUrl containing the old domain: 3',
        );
      });
    });

    describe('For badges imageUrl', function () {
      it('modify the urls domain', async function () {
        // given
        databaseBuilder.factory.buildBadge({
          id: 1,
          imageUrl: `https://${OLD_DOMAIN}/badges/url-updated.svg`,
        });
        databaseBuilder.factory.buildBadge({
          id: 2,
          imageUrl: `https://${NEW_DOMAIN}/badges/same-url.svg`,
        });
        databaseBuilder.factory.buildBadge({
          id: 3,
          imageUrl: `https://${OLD_DOMAIN}/badges/autre-dossier-surprise/dave-comp-url-updated.svg`,
        });
        databaseBuilder.factory.buildBadge({
          id: 4,
          imageUrl: `https://${OLD_DOMAIN}/https://${OLD_DOMAIN}/logo.svg`,
        });
        await databaseBuilder.commit();

        // when
        await script.handle({
          options: { file },
          logger,
        });

        // then
        const badges = await knex('badges').orderBy('id');
        expect(badges[0].imageUrl).to.equal(`https://${NEW_DOMAIN}/badges/url-updated.svg`);
        expect(badges[1].imageUrl).to.equal(`https://${NEW_DOMAIN}/badges/same-url.svg`);
        expect(badges[2].imageUrl).to.equal(
          `https://${NEW_DOMAIN}/badges/autre-dossier-surprise/dave-comp-url-updated.svg`,
        );
        expect(badges[3].imageUrl).to.equal(`https://${NEW_DOMAIN}/logo.svg`);

        expect(logger.info).to.have.been.calledWith('Number of badges with a imageUrl containing the old domain: 3');
      });
    });
  });
});
