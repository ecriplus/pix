import { calibrateConsolidatedFramework } from '../../../../../../src/certification/configuration/domain/usecases/calibrate-consolidated-framework.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | calibrate-consolidated-framework', function () {
  let complementaryCertification, consolidatedFrameworkRepository, activeCalibratedChallengeRepository;

  beforeEach(async function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((lambda) => lambda());

    complementaryCertification = domainBuilder.buildComplementaryCertification({
      complementaryCertificationKey: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
    });

    consolidatedFrameworkRepository = {
      getByCreationDateAndComplementaryKey: sinon.stub(),
      calibrate: sinon.stub(),
      save: sinon.stub(),
    };

    activeCalibratedChallengeRepository = {
      getByComplementaryKeyAndCalibrationId: sinon.stub(),
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

      consolidatedFrameworkRepository.getByCreationDateAndComplementaryKey
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          createdAt: certificationFramework.createdAt,
        })
        .resolves(certificationFramework);

      activeCalibratedChallengeRepository.getByComplementaryKeyAndCalibrationId
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
        consolidatedFrameworkRepository,
        activeCalibratedChallengeRepository,
      });

      // then
      expect(consolidatedFrameworkRepository.save).to.have.been.calledOnceWithExactly(expectedFramework);
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

      consolidatedFrameworkRepository.getByCreationDateAndComplementaryKey
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          createdAt: certificationFramework.createdAt,
        })
        .resolves(certificationFramework);

      activeCalibratedChallengeRepository.getByComplementaryKeyAndCalibrationId
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
        consolidatedFrameworkRepository,
        activeCalibratedChallengeRepository,
      });

      // then
      expect(consolidatedFrameworkRepository.save).to.have.been.calledOnceWithExactly(expectedFramework);
    });
  });
});
