import { verifyCandidateCertificability } from '../../../../../../src/certification/enrolment/domain/usecases/verify-candidate-certificability.js';
import { UserNotAuthorizedToCertifyError } from '../../../../../../src/shared/domain/errors.js';
import { catchErr, domainBuilder, expect, sinon } from '../../../../../test-helper.js';

describe('Certification | Enrolment | Unit | Domain | UseCases | verify-candidate-certificability', function () {
  let placementProfileService;

  beforeEach(function () {
    placementProfileService = {
      getPlacementProfile: sinon.stub(),
    };
  });

  context('when the candidate is not certifiable', function () {
    it('throws an error', async function () {
      // given
      const userId = 123;
      const reconciledAt = new Date();
      const candidate = domainBuilder.certification.enrolment.buildCandidate({ userId, reconciledAt });

      placementProfileService.getPlacementProfile
        .withArgs({ userId: candidate.userId, limitDate: candidate.reconciledAt })
        .resolves({ isCertifiable: sinon.stub().returns(false) });

      // when
      const error = await catchErr(verifyCandidateCertificability)({
        candidate,
        placementProfileService,
      });

      //then
      expect(error).to.be.instanceOf(UserNotAuthorizedToCertifyError);
    });
  });

  context('when the candidate is certifiable', function () {
    it('resolves', async function () {
      // given
      const userId = 123;
      const reconciledAt = new Date();
      const candidate = domainBuilder.certification.enrolment.buildCandidate({
        userId,
        reconciledAt,
      });

      placementProfileService.getPlacementProfile
        .withArgs({ userId: candidate.userId, limitDate: candidate.reconciledAt })
        .resolves({ isCertifiable: sinon.stub().returns(true) });

      // when
      // then
      return expect(
        verifyCandidateCertificability({
          candidate,
          placementProfileService,
        }),
      ).to.be.fulfilled;
    });
  });
});
