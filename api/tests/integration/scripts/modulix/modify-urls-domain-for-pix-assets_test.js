import { ModifyComplementaryCertificationBadgeUrlsDomain } from '../../../../scripts/modulix/modify-urls-domain-for-pix-assets.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

const OLD_DOMAIN = 'images.pix.fr';
const NEW_DOMAIN = 'assets.pix.org';

describe('integration | modulix | scripts | modify-urls-domain-for-pix-assets', function () {
  describe('#handle', function () {
    let file;
    let script;
    let logger;

    beforeEach(function () {
      script = new ModifyComplementaryCertificationBadgeUrlsDomain();
      logger = { info: sinon.spy(), error: sinon.spy() };
    });

    it('runs the script with dryRun', async function () {
      // given
      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        id: 1,
        label: 'Pix+ Édu 2nd degré',
        key: 'Édu',
      });
      const otherComplementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        id: 2,
        label: 'Pix+ Droit',
        key: 'Droit',
      });
      databaseBuilder.factory.buildComplementaryCertificationBadge({
        id: 1,
        imageUrl: `https://${OLD_DOMAIN}/badges/edu.svg`,
        complementaryCertificationId: complementaryCertification.id,
      });
      databaseBuilder.factory.buildComplementaryCertificationBadge({
        id: 2,
        imageUrl: `https://${OLD_DOMAIN}/badges-certifies/edu.svg`,
        complementaryCertificationId: otherComplementaryCertification.id,
      });
      await databaseBuilder.commit();

      // when
      await script.handle({
        options: { file, dryRun: true },
        logger,
      });

      // then
      expect(logger.info).to.have.been.calledWith(
        'Complementary certification badges list with old domain after update : ',
      );

      const complementaryCertificationBadges = await knex('complementary-certification-badges').orderBy('id');
      expect(complementaryCertificationBadges[0].imageUrl).to.equal(`https://${OLD_DOMAIN}/badges/edu.svg`);
      expect(complementaryCertificationBadges[1].imageUrl).to.equal(`https://${OLD_DOMAIN}/badges-certifies/edu.svg`);
    });

    describe('For complementary certification badge imageUrl', function () {
      it('modify the urls domain', async function () {
        // given
        const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
          id: 1,
          label: 'Pix+ Édu 2nd degré',
          key: 'Édu',
        });
        const otherComplementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
          id: 2,
          label: 'Pix+ Droit',
          key: 'Droit',
        });
        databaseBuilder.factory.buildComplementaryCertificationBadge({
          id: 1,
          imageUrl: `https://${OLD_DOMAIN}/badges/edu.svg`,
          complementaryCertificationId: complementaryCertification.id,
        });
        databaseBuilder.factory.buildComplementaryCertificationBadge({
          id: 2,
          imageUrl: `https://${OLD_DOMAIN}/badges/edu2.svg`,
          complementaryCertificationId: complementaryCertification.id,
        });
        databaseBuilder.factory.buildComplementaryCertificationBadge({
          id: 3,
          imageUrl: `https://${OLD_DOMAIN}/badges/Pix_plus_Edu-4-Expert-certif.svg`,
          complementaryCertificationId: otherComplementaryCertification.id,
        });
        databaseBuilder.factory.buildComplementaryCertificationBadge({
          id: 4,
          imageUrl: `https://${OLD_DOMAIN}/badges-certifies/edu.svg`,
          complementaryCertificationId: complementaryCertification.id,
        });
        await databaseBuilder.commit();

        // when
        await script.handle({
          options: { file },
          logger,
        });

        // then
        const complementaryCertificationBadges = await knex('complementary-certification-badges').orderBy('id');
        expect(complementaryCertificationBadges[0].imageUrl).to.equal(`https://${NEW_DOMAIN}/badges/edu.svg`);
        expect(complementaryCertificationBadges[1].imageUrl).to.equal(`https://${NEW_DOMAIN}/badges/edu2.svg`);
        expect(complementaryCertificationBadges[2].imageUrl).to.equal(
          `https://${NEW_DOMAIN}/badges/Pix_plus_Edu-4-Expert-certif.svg`,
        );

        expect(complementaryCertificationBadges[3].imageUrl).to.equal(`https://${NEW_DOMAIN}/badges-certifies/edu.svg`);

        expect(logger.info).to.have.been.calledWith(
          'Number of complementary certification badges with a imageUrl containing the old domain: 4',
        );
      });
    });
  });
});
