import { getCertificationCandidateSubscription } from '../../../../../../src/certification/enrolment/domain/usecases/get-certification-candidate-subscription.js';
import { ComplementaryCertificationKeys } from '../../../../../../src/certification/shared/domain/models/ComplementaryCertificationKeys.js';
import { domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Enrolment | Unit | Domain | UseCase | get-certification-candidate-subscription', function () {
  let certificationBadgesService;
  let certificationCandidateRepository;
  let centerRepository;
  let certificationCandidateData;
  const certificationCandidateId = 123;
  const userId = 456;
  const sessionId = 789;
  let sessionRepository;

  beforeEach(function () {
    certificationBadgesService = {
      findStillValidBadgeAcquisitions: sinon.stub(),
    };
    certificationCandidateRepository = {
      getWithComplementaryCertification: sinon.stub(),
    };

    centerRepository = {
      getById: sinon.stub(),
    };

    certificationCandidateData = {
      id: certificationCandidateId,
      userId,
      sessionId,
      subscriptions: [domainBuilder.buildCoreSubscription()],
      reconciledAt: new Date('2024-10-09'),
    };

    sessionRepository = {
      get: sinon.stub(),
    };
  });

  context('when the candidate is not enrolled to any complementary certification', function () {
    it('returns an empty certification candidate subscription', async function () {
      // given
      const certificationCandidate = domainBuilder.buildCertificationCandidate({
        ...certificationCandidateData,
        complementaryCertification: null,
        subscriptions: [domainBuilder.certification.enrolment.buildCoreSubscription({ certificationCandidateId })],
      });

      certificationCandidateRepository.getWithComplementaryCertification
        .withArgs({ id: certificationCandidateId })
        .resolves(certificationCandidate);

      sessionRepository.get.withArgs({ id: sessionId }).resolves(
        domainBuilder.certification.enrolment.buildSession({
          certificationCenterId: 777,
          version: 2,
        }),
      );

      // when
      const certificationCandidateSubscription = await getCertificationCandidateSubscription({
        certificationCandidateId,
        certificationBadgesService,
        certificationCandidateRepository,
        centerRepository,
        sessionRepository,
      });

      // then
      expect(certificationCandidateSubscription).to.deep.equal(
        domainBuilder.buildCertificationCandidateSubscription({
          id: certificationCandidateId,
          sessionId,
          eligibleSubscriptions: [],
          nonEligibleSubscription: null,
          sessionVersion: 2,
        }),
      );
    });
  });

  context('when the candidate is enrolled to a "simple" complementary certification', function () {
    it('returns an empty certification candidate subscription', async function () {
      // given
      const complementaryCertification = domainBuilder.buildComplementaryCertification({
        key: 'PIX+SOMETHING',
      });

      const certificationCandidate = domainBuilder.buildCertificationCandidate({
        ...certificationCandidateData,
        complementaryCertification,
        subscriptions: [
          domainBuilder.certification.enrolment.buildComplementarySubscription({
            certificationCandidateId,
            complementaryCertificationId: complementaryCertification.id,
          }),
        ],
      });

      certificationCandidateRepository.getWithComplementaryCertification
        .withArgs({ id: certificationCandidateId })
        .resolves(certificationCandidate);

      sessionRepository.get.withArgs({ id: sessionId }).resolves(
        domainBuilder.certification.enrolment.buildSession({
          certificationCenterId: 777,
          version: 2,
        }),
      );

      // when
      const certificationCandidateSubscription = await getCertificationCandidateSubscription({
        certificationCandidateId,
        certificationBadgesService,
        certificationCandidateRepository,
        centerRepository,
        sessionRepository,
      });

      // then
      expect(certificationCandidateSubscription).to.deep.equal(
        domainBuilder.buildCertificationCandidateSubscription({
          id: certificationCandidateId,
          sessionId,
          eligibleSubscriptions: [],
          nonEligibleSubscription: null,
          sessionVersion: 2,
        }),
      );
    });
  });

  context('when the center is not habilitated for the candidate whatever complementary certification', function () {
    it('returns an empty certification candidate subscription', async function () {
      // given
      const complementaryCertification = domainBuilder.buildComplementaryCertification({
        key: ComplementaryCertificationKeys.CLEA,
      });

      const certificationCandidate = domainBuilder.buildCertificationCandidate({
        ...certificationCandidateData,
        complementaryCertification,
        subscriptions: [
          domainBuilder.certification.enrolment.buildCoreSubscription({ certificationCandidateId }),
          domainBuilder.certification.enrolment.buildComplementarySubscription({
            certificationCandidateId,
            complementaryCertificationId: complementaryCertification.id,
          }),
        ],
      });

      const center = domainBuilder.certification.enrolment.buildCenter({
        habilitations: [],
      });

      certificationCandidateRepository.getWithComplementaryCertification
        .withArgs({ id: certificationCandidateId })
        .resolves(certificationCandidate);

      sessionRepository.get.withArgs({ id: sessionId }).resolves(
        domainBuilder.certification.enrolment.buildSession({
          certificationCenterId: 777,
          version: 2,
        }),
      );

      centerRepository.getById.withArgs({ id: 777 }).resolves(center);

      // when
      const certificationCandidateSubscription = await getCertificationCandidateSubscription({
        certificationCandidateId,
        certificationBadgesService,
        certificationCandidateRepository,
        centerRepository,
        sessionRepository,
      });

      // then
      expect(certificationCandidateSubscription).to.deep.equal(
        domainBuilder.buildCertificationCandidateSubscription({
          id: certificationCandidateId,
          sessionId,
          eligibleSubscriptions: [],
          nonEligibleSubscription: null,
          sessionVersion: 2,
        }),
      );
    });
  });

  context(
    'when the candidate is enrolled to a simple certification but got the double certification badge',
    function () {
      it('returns an empty certification candidate subscription', async function () {
        // given
        const complementaryCertification = domainBuilder.buildComplementaryCertification({
          key: ComplementaryCertificationKeys.PIX_PLUS_DROIT,
        });

        const certifiableBadgeAcquisition = domainBuilder.buildCertifiableBadgeAcquisition({
          complementaryCertificationKey: ComplementaryCertificationKeys.CLEA,
        });

        const certificationCandidate = domainBuilder.buildCertificationCandidate({
          ...certificationCandidateData,
          complementaryCertification,
          subscriptions: [
            domainBuilder.certification.enrolment.buildComplementarySubscription({
              certificationCandidateId,
              complementaryCertificationId: complementaryCertification.id,
            }),
          ],
        });

        const center = domainBuilder.certification.enrolment.buildCenter({
          habilitations: [complementaryCertification],
        });

        certificationCandidateRepository.getWithComplementaryCertification
          .withArgs({ id: certificationCandidateId })
          .resolves(certificationCandidate);

        sessionRepository.get.withArgs({ id: sessionId }).resolves(
          domainBuilder.certification.enrolment.buildSession({
            certificationCenterId: 777,
            version: 2,
          }),
        );

        centerRepository.getById.withArgs({ id: 777 }).resolves(center);

        certificationBadgesService.findStillValidBadgeAcquisitions
          .withArgs({ userId, limitDate: certificationCandidate.reconciledAt })
          .resolves([certifiableBadgeAcquisition]);

        // when
        const certificationCandidateSubscription = await getCertificationCandidateSubscription({
          certificationCandidateId,
          certificationBadgesService,
          certificationCandidateRepository,
          centerRepository,
          sessionRepository,
        });

        // then
        expect(certificationCandidateSubscription).to.deep.equal(
          domainBuilder.buildCertificationCandidateSubscription({
            id: certificationCandidateId,
            sessionId,
            eligibleSubscriptions: [],
            nonEligibleSubscription: null,
            sessionVersion: 2,
          }),
        );
      });
    },
  );

  context('when the candidate is enrolled to a double certification', function () {
    context('but did not get the associated badge', function () {
      it('returns an uneligible double certification candidate subscription', async function () {
        // given
        const complementaryCertification = domainBuilder.buildComplementaryCertification({
          key: ComplementaryCertificationKeys.CLEA,
        });

        const certificationCandidate = domainBuilder.buildCertificationCandidate({
          ...certificationCandidateData,
          complementaryCertification,
          subscriptions: [
            domainBuilder.certification.enrolment.buildCoreSubscription({ certificationCandidateId }),
            domainBuilder.certification.enrolment.buildComplementarySubscription({
              certificationCandidateId,
              complementaryCertificationId: complementaryCertification.id,
            }),
          ],
        });

        const center = domainBuilder.certification.enrolment.buildCenter({
          habilitations: [complementaryCertification],
        });

        certificationCandidateRepository.getWithComplementaryCertification
          .withArgs({ id: certificationCandidateId })
          .resolves(certificationCandidate);

        sessionRepository.get.withArgs({ id: sessionId }).resolves(
          domainBuilder.certification.enrolment.buildSession({
            certificationCenterId: 777,
            version: 2,
          }),
        );

        centerRepository.getById.withArgs({ id: 777 }).resolves(center);

        certificationBadgesService.findStillValidBadgeAcquisitions
          .withArgs({ userId, limitDate: certificationCandidate.reconciledAt })
          .resolves([]);

        // when
        const certificationCandidateSubscription = await getCertificationCandidateSubscription({
          certificationCandidateId,
          certificationBadgesService,
          certificationCandidateRepository,
          centerRepository,
          sessionRepository,
        });

        // then
        expect(certificationCandidateSubscription).to.deep.equal(
          domainBuilder.buildCertificationCandidateSubscription({
            id: certificationCandidateId,
            sessionId,
            eligibleSubscriptions: [],
            nonEligibleSubscription: {
              label: 'Complementary certification name',
              type: 'COMPLEMENTARY',
            },
            sessionVersion: 2,
          }),
        );
      });
    });

    context('and got the associated badge', function () {
      it('returns an eligible double certification candidate subscription', async function () {
        // given
        const complementaryCertification = domainBuilder.buildComplementaryCertification({
          key: ComplementaryCertificationKeys.CLEA,
        });

        const badge = domainBuilder.buildBadge({
          key: ComplementaryCertificationKeys.CLEA,
          isCertifiable: true,
        });

        const complementaryCertificationBadge =
          domainBuilder.certification.complementary.buildComplementaryCertificationBadge({
            badgeId: badge.id,
            complementaryCertificationId: complementaryCertification.id,
          });

        const certifiableBadgeAcquisition = domainBuilder.buildCertifiableBadgeAcquisition({
          badgeId: badge.id,
          badgeKey: badge.key,
          complementaryCertificationId: complementaryCertification.id,
          complementaryCertificationKey: complementaryCertification.key,
          complementaryCertificationBadgeId: complementaryCertificationBadge.id,
        });

        const certificationCandidate = domainBuilder.buildCertificationCandidate({
          ...certificationCandidateData,
          complementaryCertification,
          subscriptions: [
            domainBuilder.certification.enrolment.buildCoreSubscription({ certificationCandidateId }),
            domainBuilder.certification.enrolment.buildComplementarySubscription({
              certificationCandidateId,
              complementaryCertificationId: complementaryCertification.id,
            }),
          ],
        });

        const center = domainBuilder.certification.enrolment.buildCenter({
          habilitations: [complementaryCertification],
        });

        certificationCandidateRepository.getWithComplementaryCertification
          .withArgs({ id: certificationCandidateId })
          .resolves(certificationCandidate);

        sessionRepository.get.withArgs({ id: sessionId }).resolves(
          domainBuilder.certification.enrolment.buildSession({
            certificationCenterId: 777,
            version: 2,
          }),
        );

        centerRepository.getById.withArgs({ id: 777 }).resolves(center);

        certificationBadgesService.findStillValidBadgeAcquisitions
          .withArgs({ userId, limitDate: certificationCandidate.reconciledAt })
          .resolves([certifiableBadgeAcquisition]);

        // when
        const certificationCandidateSubscription = await getCertificationCandidateSubscription({
          certificationCandidateId,
          certificationBadgesService,
          certificationCandidateRepository,
          centerRepository,
          sessionRepository,
        });

        // then
        expect(certificationCandidateSubscription).to.deep.equal(
          domainBuilder.buildCertificationCandidateSubscription({
            id: certificationCandidateId,
            sessionId,
            eligibleSubscriptions: [
              {
                label: null,
                type: 'CORE',
              },
              {
                label: 'Complementary certification name',
                type: 'COMPLEMENTARY',
              },
            ],
            nonEligibleSubscription: null,
            sessionVersion: 2,
          }),
        );
      });
    });
  });
});
