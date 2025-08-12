import * as flashAlgorithmConfigurationRepository from '../../../../../../../api/src/certification/configuration/infrastructure/repositories/flash-algorithm-configuration-repository.js';
import { databaseBuilder, domainBuilder, expect, knex } from '../../../../../test-helper.js';

describe('Certification | configuration | Integration | Infrastructure | Repository | FlashAlgorithmConfigurationRepository', function () {
  describe('#save', function () {
    it('should create a flash algorithm configuration', async function () {
      // given
      const flashAlgorithmConfiguration = domainBuilder.buildFlashAlgorithmConfiguration({
        maximumAssessmentLength: 2,
        challengesBetweenSameCompetence: 3,
        variationPercent: 4,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: false,
      });

      // when
      await flashAlgorithmConfigurationRepository.save(flashAlgorithmConfiguration);

      // then
      const createdConfiguration = await knex('certification-configurations').first();
      expect(createdConfiguration.expirationDate).to.be.null;
      expect(createdConfiguration.challengesConfiguration).to.deep.equal({
        maximumAssessmentLength: 2,
        challengesBetweenSameCompetence: 3,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: false,
        variationPercent: 4,
      });
    });

    it('should create a flash algorithm configuration without forced competences', async function () {
      // given
      const flashAlgorithmConfiguration = domainBuilder.buildFlashAlgorithmConfiguration({
        maximumAssessmentLength: 2,
        challengesBetweenSameCompetence: 3,
        variationPercent: 4,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: false,
      });

      // when
      await flashAlgorithmConfigurationRepository.save(flashAlgorithmConfiguration);

      // then
      const createdConfiguration = await knex('certification-configurations').first();
      expect(createdConfiguration.expirationDate).to.be.null;
      expect(createdConfiguration.challengesConfiguration).to.deep.equal({
        maximumAssessmentLength: 2,
        challengesBetweenSameCompetence: 3,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: false,
        variationPercent: 4,
      });
    });

    it('should create a flash algorithm configuration without minimum estimated success rate ranges', async function () {
      // given
      const flashAlgorithmConfiguration = domainBuilder.buildFlashAlgorithmConfiguration({
        maximumAssessmentLength: 2,
        challengesBetweenSameCompetence: 3,
        variationPercent: 4,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: false,
      });

      // when
      await flashAlgorithmConfigurationRepository.save(flashAlgorithmConfiguration);

      // then
      const createdConfiguration = await knex('certification-configurations').first();
      expect(createdConfiguration.expirationDate).to.be.null;
      expect(createdConfiguration.challengesConfiguration).to.deep.equal({
        maximumAssessmentLength: 2,
        challengesBetweenSameCompetence: 3,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: false,
        variationPercent: 4,
      });
    });

    it('should set the expiration date of the current active configuration to the newly inserted starting date', async function () {
      // given
      const startingDateOfCurrentActive = new Date('2024-01-14');
      databaseBuilder.factory.buildCertificationConfiguration({
        startingDate: startingDateOfCurrentActive,
        expirationDate: null,
      });
      await databaseBuilder.commit();

      const flashAlgorithmConfiguration = domainBuilder.buildFlashAlgorithmConfiguration({
        maximumAssessmentLength: 2,
        challengesBetweenSameCompetence: 3,
        variationPercent: 4,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: false,
      });

      // when
      await flashAlgorithmConfigurationRepository.save(flashAlgorithmConfiguration);

      // then
      const configurations = await knex('certification-configurations').orderBy('startingDate', 'asc');
      expect(configurations).to.have.lengthOf(2);

      expect(configurations[0].startingDate).to.deep.equal(startingDateOfCurrentActive);
      expect(configurations[0].expirationDate).to.not.be.null;

      expect(configurations[1].startingDate).to.deep.equal(configurations[0].expirationDate);
      expect(configurations[1].expirationDate).to.be.null;
      expect(configurations[1].challengesConfiguration).to.deep.equal({
        maximumAssessmentLength: 2,
        challengesBetweenSameCompetence: 3,
        limitToOneQuestionPerTube: true,
        enablePassageByAllCompetences: false,
        variationPercent: 4,
      });
    });
  });
});
