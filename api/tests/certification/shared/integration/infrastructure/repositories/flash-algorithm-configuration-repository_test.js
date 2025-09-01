import dayjs from 'dayjs';

import * as flashAlgorithmConfigurationRepository from '../../../../../../../api/src/certification/shared/infrastructure/repositories/flash-algorithm-configuration-repository.js';
import { FlashAssessmentAlgorithmConfiguration } from '../../../../../../src/certification/shared/domain/models/FlashAssessmentAlgorithmConfiguration.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, domainBuilder, expect } from '../../../../../test-helper.js';

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

  describe('#getMostRecentBeforeDate', function () {
    const firstConfigDate = new Date('2020-01-01T08:00:00Z');
    const firstConfigVariationPercent = 0.1;

    const secondConfigDate = new Date('2021-01-01T08:00:00Z');
    const secondConfigVariationPercent = 0.2;

    const thirdConfigDate = new Date('2022-01-01T08:00:00Z');
    const thirdConfigVariationPercent = 0.3;

    describe('when there are saved configurations', function () {
      beforeEach(async function () {
        databaseBuilder.factory.buildCertificationConfiguration({
          startingDate: firstConfigDate,
          expirationDate: secondConfigDate,
          challengesConfiguration: {
            variationPercent: firstConfigVariationPercent,
          },
        });
        databaseBuilder.factory.buildCertificationConfiguration({
          startingDate: secondConfigDate,
          expirationDate: thirdConfigDate,
          challengesConfiguration: {
            variationPercent: secondConfigVariationPercent,
          },
        });
        databaseBuilder.factory.buildCertificationConfiguration({
          startingDate: thirdConfigDate,
          expirationDate: null,
          challengesConfiguration: {
            variationPercent: thirdConfigVariationPercent,
          },
        });
        await databaseBuilder.commit();
      });

      describe('when date is more recent than the latest configuration', function () {
        it('should return the latest configuration', async function () {
          // given
          const date = dayjs(thirdConfigDate).add(7, 'day').toDate();
          const expectedConfiguration = domainBuilder.buildFlashAlgorithmConfiguration({
            challengesBetweenSameCompetence: 2,
            createdAt: undefined,
            enablePassageByAllCompetences: false,
            limitToOneQuestionPerTube: false,
            maximumAssessmentLength: 32,
            variationPercent: thirdConfigVariationPercent,
          });

          // when
          const configResult = await flashAlgorithmConfigurationRepository.getMostRecentBeforeDate(date);

          // then
          expect(configResult).to.deep.equal(expectedConfiguration);
        });
      });

      describe('when date is between the first and second configuration', function () {
        it('should return the first configuration', async function () {
          // given
          const date = dayjs(firstConfigDate).add(7, 'day').toDate();
          const expectedConfiguration = domainBuilder.buildFlashAlgorithmConfiguration({
            challengesBetweenSameCompetence: 2,
            createdAt: undefined,
            enablePassageByAllCompetences: false,
            limitToOneQuestionPerTube: false,
            maximumAssessmentLength: 32,
            variationPercent: firstConfigVariationPercent,
          });

          // when
          const configResult = await flashAlgorithmConfigurationRepository.getMostRecentBeforeDate(date);

          // then
          expect(configResult).to.deep.equal(expectedConfiguration);
        });
      });
    });

    describe('when there is no saved configuration', function () {
      it('should throw a not found error', async function () {
        // given
        const configDate = new Date('2020-01-01T08:00:00Z');

        // when
        const error = await catchErr(flashAlgorithmConfigurationRepository.getMostRecentBeforeDate)(configDate);

        // then
        expect(error).to.be.instanceOf(NotFoundError);
      });
    });
  });
});
