import sinon from 'sinon';

import { MigrateCertificationConfigurationsToVersionsScript } from '../../../../scripts/certification/migrate-certification-configurations-to-versions.js';
import { databaseBuilder, expect, knex } from '../../../test-helper.js';

describe('Integration | Scripts | Certification | migrate-certification-configurations-to-versions', function () {
  let script;
  let logger;

  beforeEach(function () {
    script = new MigrateCertificationConfigurationsToVersionsScript();
    logger = {
      info: sinon.stub(),
      error: sinon.stub(),
    };
  });

  context('when there are configurations to migrate', function () {
    it('should migrate configurations from certification-configurations to certification_versions and update frameworks', async function () {
      // given
      const startingDate1 = new Date('2020-01-01');
      const expirationDate1 = new Date('2021-01-01');
      const startingDate2 = new Date('2021-01-01');
      const version1 = '20200101000000';
      const version2 = '20210101000000';

      const challengesConfig = {
        maximumAssessmentLength: 20,
        challengesBetweenSameCompetence: 3,
        limitToOneQuestionPerTube: false,
        enablePassageByAllCompetences: true,
        variationPercent: 0.5,
      };

      const globalScoringConfig = [
        { bounds: { max: -2.6789, min: -5.12345 }, meshLevel: 0 },
        { bounds: { max: -0.23456, min: -2.6789 }, meshLevel: 1 },
      ];

      const competencesScoringConfig = [
        {
          competence: '1.1',
          values: [
            { bounds: { max: 0, min: -5 }, competenceLevel: 0 },
            { bounds: { max: 5, min: 0 }, competenceLevel: 1 },
          ],
        },
      ];

      databaseBuilder.factory.buildCertificationConfiguration({
        startingDate: startingDate1,
        expirationDate: expirationDate1,
        challengesConfiguration: challengesConfig,
        globalScoringConfiguration: globalScoringConfig,
        competencesScoringConfiguration: competencesScoringConfig,
      });

      databaseBuilder.factory.buildCertificationConfiguration({
        startingDate: startingDate2,
        expirationDate: null,
        challengesConfiguration: challengesConfig,
        globalScoringConfiguration: globalScoringConfig,
        competencesScoringConfiguration: competencesScoringConfig,
      });

      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification();

      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        version: version1,
        challengeId: 'recChallenge1',
        complementaryCertificationKey: complementaryCertification.key,
      });
      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        version: version2,
        challengeId: 'recChallenge2',
        complementaryCertificationKey: complementaryCertification.key,
      });

      await databaseBuilder.commit();

      // when
      await script.handle({ options: { dryRun: false, versions: [version1, version2] }, logger });

      // then
      const versions = await knex('certification_versions').select('*').orderBy('startDate', 'asc');

      expect(versions).to.have.lengthOf(2);

      expect(versions[0]).to.deep.include({
        scope: 'CORE',
        assessmentDuration: 105,
      });
      expect(versions[0].startDate).to.deep.equal(startingDate1);
      expect(versions[0].expirationDate).to.deep.equal(expirationDate1);
      expect(versions[0].challengesConfiguration).to.deep.equal(challengesConfig);
      expect(versions[0].globalScoringConfiguration).to.deep.equal(globalScoringConfig);
      expect(versions[0].competencesScoringConfiguration).to.deep.equal(competencesScoringConfig);

      expect(versions[1]).to.deep.include({
        scope: 'CORE',
        assessmentDuration: 105,
      });
      expect(versions[1].startDate).to.deep.equal(startingDate2);
      expect(versions[1].expirationDate).to.be.null;
      expect(versions[1].challengesConfiguration).to.deep.equal(challengesConfig);
      expect(versions[1].globalScoringConfiguration).to.deep.equal(globalScoringConfig);
      expect(versions[1].competencesScoringConfiguration).to.deep.equal(competencesScoringConfig);

      const frameworks = await knex('certification-frameworks-challenges')
        .select('version', 'versionId')
        .orderBy('version', 'asc');

      expect(frameworks).to.have.lengthOf(2);
      expect(frameworks[0].version).to.equal(version1);
      expect(frameworks[0].versionId).to.equal(versions[0].id);
      expect(frameworks[1].version).to.equal(version2);
      expect(frameworks[1].versionId).to.equal(versions[1].id);
    });

    it('should not commit when dryRun is true', async function () {
      // given
      const startingDate = new Date('2020-01-01');
      const version = '20200101000000';

      databaseBuilder.factory.buildCertificationConfiguration({
        startingDate,
        expirationDate: null,
      });

      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification();

      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        version,
        challengeId: 'recChallenge1',
        complementaryCertificationKey: complementaryCertification.key,
      });

      await databaseBuilder.commit();

      // when
      await script.handle({ options: { dryRun: true, versions: [version] }, logger });

      // then
      const versions = await knex('certification_versions').select('*');
      expect(versions).to.have.lengthOf(0);
    });
  });

  context('when there are no configurations to migrate', function () {
    it('should return 0 without error', async function () {
      // when
      const result = await script.handle({ options: { dryRun: false, versions: [] }, logger });

      // then
      expect(result).to.equal(0);
      const versions = await knex('certification_versions').select('*');
      expect(versions).to.have.lengthOf(0);
    });
  });

  context('when versions count does not match configurations count', function () {
    it('should throw an error', async function () {
      // given
      const startingDate = new Date('2020-01-01');

      databaseBuilder.factory.buildCertificationConfiguration({
        startingDate,
        expirationDate: null,
      });

      await databaseBuilder.commit();

      // when / then
      await expect(script.handle({ options: { dryRun: false, versions: [] }, logger })).to.be.rejectedWith(
        'Configurations count should be the same as versions count',
      );
    });
  });
});
