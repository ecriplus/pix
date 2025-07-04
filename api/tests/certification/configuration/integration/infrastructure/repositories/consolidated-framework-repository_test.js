import * as consolidatedFrameworkRepository from '../../../../../../src/certification/configuration/infrastructure/repositories/consolidated-framework-repository.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, domainBuilder, expect, knex } from '../../../../../test-helper.js';

describe('Certification | Configuration | Integration | Repository | consolidated-framework', function () {
  describe('#create', function () {
    it('should create a consolidated framework for a given certification key', async function () {
      // given
      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification();

      const challenge1 = databaseBuilder.factory.learningContent.buildChallenge({
        id: 'challenge1',
        alpha: 1.33,
        delta: 2.2,
      });
      const challenge2 = databaseBuilder.factory.learningContent.buildChallenge({
        id: 'challenge2',
        alpha: 4.2,
        delta: -2,
      });
      await databaseBuilder.commit();

      // when
      await consolidatedFrameworkRepository.create({
        complementaryCertificationKey: complementaryCertification.key,
        challenges: [challenge1, challenge2],
        version: '1234',
      });

      // then
      const consolidatedFrameworkInDB = await knex('certification-frameworks-challenges').select(
        'complementaryCertificationKey',
        'challengeId',
        'discriminant',
        'difficulty',
        'createdAt',
        'version',
      );

      expect(consolidatedFrameworkInDB).to.have.lengthOf(2);
      expect(consolidatedFrameworkInDB[0].discriminant).to.equal(null);
      expect(consolidatedFrameworkInDB[0].difficulty).to.equal(null);
      expect(consolidatedFrameworkInDB[0].challengeId).to.equal(challenge1.id);
      expect(consolidatedFrameworkInDB[1].challengeId).to.equal(challenge2.id);
      expect(consolidatedFrameworkInDB[0].complementaryCertificationKey).to.equal(
        consolidatedFrameworkInDB[1].complementaryCertificationKey,
      );
      expect(consolidatedFrameworkInDB[0].version).to.equal(consolidatedFrameworkInDB[1].version);
    });
  });

  describe('#getCurrentFrameworkByComplementaryCertificationKey', function () {
    it('should get the current complementary certification framework', async function () {
      // given
      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification();

      const challenge = databaseBuilder.factory.learningContent.buildChallenge({ id: 'challengeId1234' });

      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        complementaryCertificationKey: complementaryCertification.key,
        createdAt: new Date('2023-01-11'),
        calibrationId: 123,
        challengeId: challenge.id,
      });

      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        complementaryCertificationKey: complementaryCertification.key,
        createdAt: new Date('2025-06-21'),
        calibrationId: 123,
        challengeId: challenge.id,
      });

      await databaseBuilder.commit();

      // when
      const currentConsolidatedFramework =
        await consolidatedFrameworkRepository.getCurrentFrameworkByComplementaryCertificationKey({
          complementaryCertificationKey: complementaryCertification.key,
        });

      // then
      expect(_.omit(currentConsolidatedFramework, 'createdAt')).to.deep.equal({
        calibrationId: 123,
        complementaryCertificationKey: complementaryCertification.key,
        challenges: [
          {
            challengeId: 'challengeId1234',
            difficulty: 3.5,
            discriminant: 2.2,
          },
        ],
      });
    });
  });

  describe('#getByCreationDateAndComplementaryKey', function () {
    it('should return an error when it does not exist', async function () {
      // given
      const createdAt = new Date();
      const complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT;

      // when
      const error = await catchErr(consolidatedFrameworkRepository.getByCreationDateAndComplementaryKey)({
        complementaryCertificationKey,
        createdAt,
      });

      // then
      // then
      expect(error).to.deepEqualInstance(new NotFoundError('Consolidated framework does not exist'));
    });

    it('should return a consolidated framework sorted by challengeId', async function () {
      // given
      const createdAt = new Date();
      const otherCreatedAt = new Date('2023-06-23');
      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification();
      const secondChallengeSelected = databaseBuilder.factory.buildCertificationFrameworksChallenge({
        createdAt,
        challengeId: 'rec234',
        complementaryCertificationKey: complementaryCertification.key,
      });
      const firstChallengeSelected = databaseBuilder.factory.buildCertificationFrameworksChallenge({
        createdAt,
        challengeId: 'rec123',
        complementaryCertificationKey: complementaryCertification.key,
      });
      databaseBuilder.factory.buildCertificationFrameworksChallenge({
        createdAt: otherCreatedAt,
        challengeId: 'rec234',
        complementaryCertificationKey: complementaryCertification.key,
      });
      await databaseBuilder.commit();

      const expectedFrameworkChallenges = domainBuilder.certification.configuration.buildConsolidatedFramework({
        complementaryCertificationKey: complementaryCertification.key,
        createdAt,
        challenges: [
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            challengeId: firstChallengeSelected.challengeId,
            discriminant: firstChallengeSelected.discriminant,
            difficulty: firstChallengeSelected.difficulty,
          }),
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            challengeId: secondChallengeSelected.challengeId,
            discriminant: secondChallengeSelected.discriminant,
            difficulty: secondChallengeSelected.difficulty,
          }),
        ],
      });

      // when
      const certificationFrameworksChallenges =
        await consolidatedFrameworkRepository.getByCreationDateAndComplementaryKey({
          complementaryCertificationKey: complementaryCertification.key,
          createdAt,
        });

      // then
      expect(certificationFrameworksChallenges).to.deep.equal(expectedFrameworkChallenges);
    });
  });

  describe('#save', function () {
    it('should update framework challenges with discriminant, difficulty and calibrationId properties', async function () {
      // given
      const complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT;
      const complementaryCertification = databaseBuilder.factory.buildComplementaryCertification({
        key: complementaryCertificationKey,
      });

      const firstCertificationFrameworksChallenge = databaseBuilder.factory.buildCertificationFrameworksChallenge({
        complementaryCertificationKey: complementaryCertification.key,
        createdAt: new Date('2022-01-01T08:00:00Z'),
        challengeId: 'rec123',
        discriminant: null,
        difficulty: null,
      });

      const secondCertificationFrameworksChallenge = databaseBuilder.factory.buildCertificationFrameworksChallenge({
        complementaryCertificationKey: complementaryCertification.key,
        createdAt: firstCertificationFrameworksChallenge.createdAt,
        challengeId: 'rec456',
        discriminant: null,
        difficulty: null,
      });

      await databaseBuilder.commit();

      const firstCalibratedCertificationFrameworksChallenge =
        domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
          challengeId: firstCertificationFrameworksChallenge.challengeId,
          discriminant: 1.3,
          difficulty: 4.3,
        });
      const secondCalibratedCertificationFrameworksChallenge =
        domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
          challengeId: secondCertificationFrameworksChallenge.challengeId,
          discriminant: 3.2,
          difficulty: 1.5,
        });

      const consolidatedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
        calibrationId: 1,
        challenges: [firstCalibratedCertificationFrameworksChallenge, secondCalibratedCertificationFrameworksChallenge],
        complementaryCertificationKey: complementaryCertification.key,
        createdAt: firstCertificationFrameworksChallenge.createdAt,
      });

      const expectedCalibratedFrameworkChallenges = [
        {
          ...firstCertificationFrameworksChallenge,
          discriminant: firstCalibratedCertificationFrameworksChallenge.discriminant,
          difficulty: firstCalibratedCertificationFrameworksChallenge.difficulty,
          calibrationId: consolidatedFramework.calibrationId,
        },
        {
          ...secondCertificationFrameworksChallenge,
          discriminant: secondCalibratedCertificationFrameworksChallenge.discriminant,
          difficulty: secondCalibratedCertificationFrameworksChallenge.difficulty,
          calibrationId: consolidatedFramework.calibrationId,
        },
      ];

      // when
      await consolidatedFrameworkRepository.save(consolidatedFramework);

      // then
      const calibratedFrameworksChallenges = await knex('certification-frameworks-challenges');
      expect(calibratedFrameworksChallenges).to.have.deep.members(expectedCalibratedFrameworkChallenges);
    });
  });
});
