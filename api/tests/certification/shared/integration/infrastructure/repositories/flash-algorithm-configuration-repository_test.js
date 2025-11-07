import * as flashAlgorithmConfigurationRepository from '../../../../../../../api/src/certification/shared/infrastructure/repositories/flash-algorithm-configuration-repository.js';
import { FlashAssessmentAlgorithmConfiguration } from '../../../../../../src/certification/shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../../test-helper.js';

describe('Certification | Shared | Integration | Infrastructure | Repository | FlashAlgorithmConfigurationRepository', function () {
  describe('#getMostRecent', function () {
    describe('when there is a saved configuration', function () {
      it('should return a flash algorithm configuration', async function () {
        // given
        databaseBuilder.factory.buildCertificationConfiguration({
          challengesConfiguration: {
            maximumAssessmentLength: 10,
            challengesBetweenSameCompetence: 20,
            limitToOneQuestionPerTube: true,
            enablePassageByAllCompetences: true,
            variationPercent: 0.8,
          },
        });

        await databaseBuilder.commit();

        // when
        const configResult = await flashAlgorithmConfigurationRepository.getMostRecent();

        // then
        expect(configResult).to.deep.equal({
          maximumAssessmentLength: 10,
          challengesBetweenSameCompetence: 20,
          limitToOneQuestionPerTube: true,
          enablePassageByAllCompetences: true,
          variationPercent: 0.8,
        });
      });
    });

    describe('when there are multiple saved configurations', function () {
      it('should return the latest', async function () {
        // given
        databaseBuilder.factory.buildCertificationConfiguration({
          startingDate: new Date('2020-01-01'),
          expirationDate: new Date('2020-12-01'),
          challengesConfiguration: {
            maximumAssessmentLength: 1000,
            challengesBetweenSameCompetence: 2000,
            variationPercent: 3000,
            limitToOneQuestionPerTube: false,
            enablePassageByAllCompetences: true,
          },
        });

        const latestFlashAlgorithmConfiguration = databaseBuilder.factory.buildCertificationConfiguration({
          startingDate: new Date('2020-12-01'),
          expirationDate: null,
          challengesConfiguration: {
            maximumAssessmentLength: 2,
            challengesBetweenSameCompetence: 3,
            variationPercent: 4,
            limitToOneQuestionPerTube: true,
            enablePassageByAllCompetences: false,
          },
        });

        const expectedFlashAlgorithmConfiguration = domainBuilder.buildFlashAlgorithmConfiguration(
          JSON.parse(latestFlashAlgorithmConfiguration.challengesConfiguration),
        );

        await databaseBuilder.commit();

        // when
        const configResult = await flashAlgorithmConfigurationRepository.getMostRecent();

        // then
        expect(configResult).to.deep.equal(expectedFlashAlgorithmConfiguration);
      });
    });

    describe('when there is no saved configuration', function () {
      it('should return default configuration', async function () {
        // when
        const configResult = await flashAlgorithmConfigurationRepository.getMostRecent();

        // then
        expect(configResult).to.be.instanceOf(FlashAssessmentAlgorithmConfiguration);
      });
    });
  });
});
