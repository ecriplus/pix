import { calibrateConsolidatedFramework } from '../../../../../../src/certification/configuration/domain/usecases/calibrate-consolidated-framework.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { DomainTransaction } from '../../../../../../src/shared/domain/DomainTransaction.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Configuration | Unit | UseCase | calibrate-consolidated-framework', function () {
  let createdAt,
    calibrationId,
    complementaryCertification,
    complementaryCertificationKey,
    certificationFrameworksChallengeRepository,
    activeCalibratedChallengeRepository;

  beforeEach(async function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((lambda) => lambda());
    createdAt = new Date();
    calibrationId = '1234';
    complementaryCertificationKey = ComplementaryCertificationKeys.PIX_PLUS_DROIT;
    complementaryCertification = domainBuilder.buildComplementaryCertification({
      complementaryCertificationKey,
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

  describe('when database contains as many challenges than datamart', function () {
    it('calibrates the certification frameworks challenges given its creation date', async function () {
      // given
      const challengeId = 'rec123';
      const certificationFrameworksChallenges = domainBuilder.certification.configuration.buildConsolidatedFramework({
        challenges: [
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId,
            createdAt,
            discriminant: null,
            difficulty: null,
          }),
        ],
      });
      const activeCalibratedChallenges = [
        domainBuilder.certification.configuration.buildActiveCalibratedChallenge({
          scope: complementaryCertificationKey,
          challengeId,
          discriminant: 1.4,
          difficulty: 2.2,
        }),
      ];

      const expectedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
        complementaryCertificationKey: complementaryCertification.key,
        createdAt,
        challenges: [
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            ...certificationFrameworksChallenges[0],
            discriminant: activeCalibratedChallenges[0].discriminant,
            difficulty: activeCalibratedChallenges[0].difficulty,
          }),
        ],
      });

      certificationFrameworksChallengeRepository.findByCreationDateAndComplementaryKey
        .withArgs({ complementaryCertificationKey: complementaryCertification.key, createdAt })
        .resolves(certificationFrameworksChallenges);

      activeCalibratedChallengeRepository.findByComplementaryKeyAndCalibrationId
        .withArgs({
          complementaryCertificationKey,
          calibrationId,
        })
        .resolves(activeCalibratedChallenges);

      // when
      await calibrateConsolidatedFramework({
        complementaryCertificationKey,
        createdAt,
        calibrationId,
        certificationFrameworksChallengeRepository,
        activeCalibratedChallengeRepository,
      });

      // then
      expect(certificationFrameworksChallengeRepository.save).to.have.been.calledOnceWithExactly(expectedFramework);
    });
  });

  describe('when database contains more challenges than datamart', function () {
    it('calibrates the certification frameworks challenges given its creation date', async function () {
      // given
      const calibratedChallengeIdOne = 'rec456';
      const calibratedChallengeIdTwo = 'rec999';
      const certificationFrameworksChallenges = domainBuilder.certification.configuration.buildConsolidatedFramework({
        challenges: [
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId: 'rec123',
            createdAt,
            discriminant: null,
            difficulty: null,
          }),
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId: calibratedChallengeIdOne,
            createdAt,
            discriminant: null,
            difficulty: null,
          }),
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId: 'rec567',
            createdAt,
            discriminant: null,
            difficulty: null,
          }),
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId: 'rec568',
            createdAt,
            discriminant: null,
            difficulty: null,
          }),
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId: calibratedChallengeIdTwo,
            createdAt,
            discriminant: null,
            difficulty: null,
          }),
        ],
      });
      const activeCalibratedChallenges = [
        domainBuilder.certification.configuration.buildActiveCalibratedChallenge({
          scope: complementaryCertificationKey,
          challengeId: calibratedChallengeIdOne,
          discriminant: 1.4,
          difficulty: 2.2,
        }),
        domainBuilder.certification.configuration.buildActiveCalibratedChallenge({
          scope: complementaryCertificationKey,
          challengeId: calibratedChallengeIdTwo,
          discriminant: 3.3,
          difficulty: 4.4,
        }),
      ];

      const expectedFramework = domainBuilder.certification.configuration.buildConsolidatedFramework({
        complementaryCertificationKey: complementaryCertification.key,
        createdAt,
        challenges: [
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId: 'rec123',
            createdAt,
            discriminant: null,
            difficulty: null,
          }),
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId: calibratedChallengeIdOne,
            createdAt,
            discriminant: 1.4,
            difficulty: 2.2,
          }),
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId: 'rec567',
            createdAt,
            discriminant: null,
            difficulty: null,
          }),
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId: 'rec568',
            createdAt,
            discriminant: null,
            difficulty: null,
          }),
          domainBuilder.certification.configuration.buildCertificationFrameworksChallenge({
            complementaryCertificationKey: complementaryCertification.key,
            challengeId: calibratedChallengeIdTwo,
            createdAt,
            discriminant: 3.3,
            difficulty: 4.4,
          }),
        ],
      });

      certificationFrameworksChallengeRepository.findByCreationDateAndComplementaryKey
        .withArgs({ complementaryCertificationKey: complementaryCertification.key, createdAt })
        .resolves(certificationFrameworksChallenges);

      activeCalibratedChallengeRepository.findByComplementaryKeyAndCalibrationId
        .withArgs({
          complementaryCertificationKey,
          calibrationId,
        })
        .resolves(activeCalibratedChallenges);

      // when
      await calibrateConsolidatedFramework({
        complementaryCertificationKey,
        createdAt,
        calibrationId,
        certificationFrameworksChallengeRepository,
        activeCalibratedChallengeRepository,
      });

      // then
      expect(certificationFrameworksChallengeRepository.save).to.have.been.calledOnceWithExactly(expectedFramework);
    });
  });
});
