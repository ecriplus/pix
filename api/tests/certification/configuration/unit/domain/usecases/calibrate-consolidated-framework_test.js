import { calibrateConsolidatedFramework } from '../../../../../../src/certification/configuration/domain/usecases/calibrate-consolidated-framework.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | calibrate-consolidated-framework', function () {
  let complementaryCertification, certificationFrameworksChallengeRepository, activeCalibratedChallengeRepository;

  beforeEach(async function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((lambda) => lambda());

    complementaryCertification = domainBuilder.buildComplementaryCertification({
      complementaryCertificationKey: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
    });

    certificationFrameworksChallengeRepository = {
      findByCreationDateAndComplementaryKey: sinon.stub(),
      calibrate: sinon.stub(),
      save: sinon.stub(),
    };

    activeCalibratedChallengeRepository = {
      findByComplementaryKeyAndCalibrationId: sinon.stub(),
    };
  });

  describe('when consolidated framework has as many challenges as active calibrated ones, given both scope and creation date', function () {
    it('calibrates the consolidated framework', async function () {
      // given
      const calibrationId = 1;

      const certificationFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
        createdAt: new Date(),
        complementaryCertificationKey: complementaryCertification.key,
        challenges: [
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            challengeId: 'rec1234',
            discriminant: null,
            difficulty: null,
          }),
        ],
      });

      const activeCalibratedChallenges = [
        domainBuilder.certification.configuration.buildActiveCalibratedChallenge({
          scope: complementaryCertification.key,
          challengeId: certificationFramework.challenges[0].challengeId,
          discriminant: 1.4,
          difficulty: 2.2,
        }),
      ];

      const expectedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
        calibrationId,
        createdAt: certificationFramework.createdAt,
        complementaryCertificationKey: complementaryCertification.key,
        challenges: [
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            challengeId: certificationFramework.challenges[0].challengeId,
            discriminant: activeCalibratedChallenges[0].discriminant,
            difficulty: activeCalibratedChallenges[0].difficulty,
          }),
        ],
      });

      certificationFrameworksChallengeRepository.findByCreationDateAndComplementaryKey
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          createdAt: certificationFramework.createdAt,
        })
        .resolves(certificationFramework);

      activeCalibratedChallengeRepository.findByComplementaryKeyAndCalibrationId
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          calibrationId,
        })
        .resolves(activeCalibratedChallenges);

      // when
      await calibrateConsolidatedFramework({
        complementaryCertificationKey: certificationFramework.complementaryCertificationKey,
        createdAt: certificationFramework.createdAt,
        calibrationId,
        certificationFrameworksChallengeRepository,
        activeCalibratedChallengeRepository,
      });

      // then
      expect(certificationFrameworksChallengeRepository.save).to.have.been.calledOnceWithExactly(expectedFramework);
    });
  });

  describe('when consolidated framework has more challenges than active calibrated ones, given both scope and creation date', function () {
    it('calibrates the consolidated framework', async function () {
      // given
      const calibrationId = 1;

      const certificationFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
        createdAt: new Date(),
        complementaryCertificationKey: complementaryCertification.key,
        challenges: [
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            challengeId: 'rec1234',
            discriminant: null,
            difficulty: null,
          }),
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            challengeId: 'rec3456',
            discriminant: null,
            difficulty: null,
          }),
        ],
      });

      const activeCalibratedChallenges = [
        domainBuilder.certification.configuration.buildActiveCalibratedChallenge({
          scope: complementaryCertification.key,
          challengeId: certificationFramework.challenges[1].challengeId,
          discriminant: 1.4,
          difficulty: 2.2,
        }),
      ];

      const expectedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
        calibrationId,
        createdAt: certificationFramework.createdAt,
        complementaryCertificationKey: complementaryCertification.key,
        challenges: [
          certificationFramework.challenges[0],
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            challengeId: certificationFramework.challenges[1].challengeId,
            discriminant: activeCalibratedChallenges[0].discriminant,
            difficulty: activeCalibratedChallenges[0].difficulty,
          }),
        ],
      });

      certificationFrameworksChallengeRepository.findByCreationDateAndComplementaryKey
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          createdAt: certificationFramework.createdAt,
        })
        .resolves(certificationFramework);

      activeCalibratedChallengeRepository.findByComplementaryKeyAndCalibrationId
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          calibrationId,
        })
        .resolves(activeCalibratedChallenges);

      // when
      await calibrateConsolidatedFramework({
        complementaryCertificationKey: certificationFramework.complementaryCertificationKey,
        createdAt: certificationFramework.createdAt,
        calibrationId,
        certificationFrameworksChallengeRepository,
        activeCalibratedChallengeRepository,
      });

      // then
      expect(certificationFrameworksChallengeRepository.save).to.have.been.calledOnceWithExactly(expectedFramework);
    });
  });

  describe('when there is no active calibrated challenges, given our scope and creation date', function () {
    it('should throw a not found error', async function () {
      // given
      const calibrationId = 1;

      const certificationFramework = domainBuilder.certification.configuration.buildConsolidatedFramework();

      certificationFrameworksChallengeRepository.findByCreationDateAndComplementaryKey
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          createdAt: certificationFramework.createdAt,
        })
        .resolves(certificationFramework);

      activeCalibratedChallengeRepository.findByComplementaryKeyAndCalibrationId
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          calibrationId,
        })
        .resolves([]);

      // when
      const error = await catchErr(calibrateConsolidatedFramework)({
        complementaryCertificationKey: certificationFramework.complementaryCertificationKey,
        createdAt: certificationFramework.createdAt,
        calibrationId,
        certificationFrameworksChallengeRepository,
        activeCalibratedChallengeRepository,
      });

      // then
      expect(error).to.instanceOf(NotFoundError);
      expect(error.message).to.equal(
        `Not found calibration (id: ${calibrationId}) for ${certificationFramework.complementaryCertificationKey}`,
      );
      expect(certificationFrameworksChallengeRepository.save).to.not.have.been.called;
    });
  });
});
