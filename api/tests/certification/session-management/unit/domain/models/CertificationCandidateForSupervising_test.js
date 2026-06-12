import { Frameworks } from '../../../../../../src/certification/shared/domain/models/Frameworks.js';
import { expect } from '../../../../../test-helper.js';
import { domainBuilder } from '../../../../../tooling/domain-builder/domain-builder.js';

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
    context('when candidate is enrolled for CLEA and has a valid badge', function () {
      it('returns true', function () {
        // given
        const certificationCandidateForSupervising = domainBuilder.buildCertificationCandidateForSupervising({
          subscription: Frameworks.CLEA,
          stillValidBadgeAcquisitions: [
            domainBuilder.buildCertifiableBadgeAcquisition({
              complementaryCertificationKey: Frameworks.CLEA,
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

    context('when candidate is not enrolled for CLEA', function () {
      it('returns false', function () {
        // given
        const certificationCandidateForSupervising = domainBuilder.buildCertificationCandidateForSupervising({
          subscription: Frameworks.CORE,
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
