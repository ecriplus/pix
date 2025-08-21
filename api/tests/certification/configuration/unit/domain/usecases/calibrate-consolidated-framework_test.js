import { calibrateConsolidatedFramework } from '../../../../../../src/certification/configuration/domain/usecases/calibrate-consolidated-framework.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { NotFoundError } from '../../../../../../src/shared/domain/errors.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | calibrate-consolidated-framework', function () {
  let complementaryCertification, consolidatedFrameworkRepository, activeCalibratedChallengeRepository;

  beforeEach(async function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((lambda) => lambda());

    complementaryCertification = domainBuilder.certification.shared.buildComplementaryCertification({
      complementaryCertificationKey: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
    });

    consolidatedFrameworkRepository = {
      getByVersionAndComplementaryKey: sinon.stub(),
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

      const consolidatedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
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
          challengeId: consolidatedFramework.challenges[0].challengeId,
          discriminant: 1.4,
          difficulty: 2.2,
        }),
      ];

      const expectedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
        calibrationId,
        version: consolidatedFramework.version,
        complementaryCertificationKey: complementaryCertification.key,
        challenges: [
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            challengeId: consolidatedFramework.challenges[0].challengeId,
            discriminant: activeCalibratedChallenges[0].discriminant,
            difficulty: activeCalibratedChallenges[0].difficulty,
          }),
        ],
      });

      consolidatedFrameworkRepository.getByVersionAndComplementaryKey
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          version: consolidatedFramework.version,
        })
        .resolves(consolidatedFramework);

      activeCalibratedChallengeRepository.getByComplementaryKeyAndCalibrationId
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          calibrationId,
        })
        .resolves(activeCalibratedChallenges);

      // when
      await calibrateConsolidatedFramework({
        complementaryCertificationKey: consolidatedFramework.complementaryCertificationKey,
        version: consolidatedFramework.version,
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

      const consolidatedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
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
          challengeId: consolidatedFramework.challenges[1].challengeId,
          discriminant: 1.4,
          difficulty: 2.2,
        }),
      ];

      const expectedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
        calibrationId,
        version: consolidatedFramework.version,
        complementaryCertificationKey: complementaryCertification.key,
        challenges: [
          consolidatedFramework.challenges[0],
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            challengeId: consolidatedFramework.challenges[1].challengeId,
            discriminant: activeCalibratedChallenges[0].discriminant,
            difficulty: activeCalibratedChallenges[0].difficulty,
          }),
        ],
      });

      consolidatedFrameworkRepository.getByVersionAndComplementaryKey
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          version: consolidatedFramework.version,
        })
        .resolves(consolidatedFramework);

      activeCalibratedChallengeRepository.getByComplementaryKeyAndCalibrationId
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          calibrationId,
        })
        .resolves(activeCalibratedChallenges);

      // when
      await calibrateConsolidatedFramework({
        complementaryCertificationKey: consolidatedFramework.complementaryCertificationKey,
        version: consolidatedFramework.version,
        calibrationId,
        consolidatedFrameworkRepository,
        activeCalibratedChallengeRepository,
      });

      // then
      expect(consolidatedFrameworkRepository.save).to.have.been.calledOnceWithExactly(expectedFramework);
    });
  });

  describe('when active calibrated has more challenges than consolidated framework ones', function () {
    it('should return an error', async function () {
      // given
      const calibrationId = 1;

      const consolidatedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
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
          challengeId: consolidatedFramework.challenges[0].challengeId,
          discriminant: 1.4,
          difficulty: 2.2,
        }),
        domainBuilder.certification.configuration.buildActiveCalibratedChallenge({
          scope: complementaryCertification.key,
        }),
      ];

      consolidatedFrameworkRepository.getByVersionAndComplementaryKey
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          version: consolidatedFramework.version,
        })
        .resolves(consolidatedFramework);

      activeCalibratedChallengeRepository.getByComplementaryKeyAndCalibrationId
        .withArgs({
          complementaryCertificationKey: complementaryCertification.key,
          calibrationId,
        })
        .resolves(activeCalibratedChallenges);

      // when
      const error = await catchErr(calibrateConsolidatedFramework)({
        complementaryCertificationKey: consolidatedFramework.complementaryCertificationKey,
        version: consolidatedFramework.version,
        calibrationId,
        consolidatedFrameworkRepository,
        activeCalibratedChallengeRepository,
      });

      // then
      expect(error).to.be.an.instanceof(NotFoundError);
      expect(error.message).to.equal('The challenge rec123 does not exist in the consolidatedFramework challenges');
    });
  });
});
