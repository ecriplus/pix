import { domainBuilder, expect } from '../../../../../test-helper.js';

describe('Unit | Domain | Models | Certification Candidate for supervising', function () {
  describe('#authorizeToStart', function () {
    it('Should update authorizeToStart property to true', function () {
      // given
      const certificationCandidateForSupervising = domainBuilder.buildCertificationCandidateForSupervising({
        authorizedToStart: false,
      });

      // when
      certificationCandidateForSupervising.authorizeToStart();

      // then
      expect(certificationCandidateForSupervising.authorizedToStart).to.be.true;
    });
  });

  describe('#isStillEligibleToDoubleCertification', function () {
    context('when candidate has a valid double certification badge acquisition', function () {
      it('returns true', function () {
        // given
        const complementaryCertification = domainBuilder.buildComplementaryCertificationForSupervising({
          key: 'aKey',
        });

        const certificationCandidateForSupervising = domainBuilder.buildCertificationCandidateForSupervising({
          enrolledComplementaryCertification: complementaryCertification,
          stillValidBadgeAcquisitions: [
            domainBuilder.buildCertifiableBadgeAcquisition({
              complementaryCertificationKey: 'aKey',
            }),
          ],
        });

        // when
        const isStillEligibleToDoubleCertification =
          certificationCandidateForSupervising.isStillEligibleToDoubleCertification;

        // then
        expect(isStillEligibleToDoubleCertification).to.be.true;
      });
    });

    context('when candidate has no double certification badge acquisition', function () {
      it('returns false', function () {
        // given
        const certificationCandidateForSupervising = domainBuilder.buildCertificationCandidateForSupervising({
          enrolledComplementaryCertification: null,
          stillValidBadgeAcquisitions: [],
        });

        // when
        const isStillEligibleToDoubleCertification =
          certificationCandidateForSupervising.isStillEligibleToDoubleCertification;

        // then
        expect(isStillEligibleToDoubleCertification).to.be.false;
      });
    });
  });
});
