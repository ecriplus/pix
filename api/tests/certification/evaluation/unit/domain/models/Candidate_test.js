import { Candidate } from '../../../../../../src/certification/evaluation/domain/models/Candidate.js';
import { SCOPES } from '../../../../../../src/certification/shared/domain/models/Scopes.js';
import { EntityValidationError } from '../../../../../../src/shared/domain/errors.js';
import { catchErrSync, domainBuilder, expect } from '../../../../../test-helper.js';

describe('Certification | Evaluation | Unit | Domain | Models | Candidate', function () {
  context('#constructor', function () {
    it('should build an evaluated candidate', function () {
      // given
      // when
      const candidate = new Candidate({
        accessibilityAdjustmentNeeded: true,
        reconciledAt: new Date('2024-10-18'),
        subscriptionScope: SCOPES.CORE,
        hasCleaSubscription: false,
      });

      // then
      expect(candidate).to.deep.equal({
        accessibilityAdjustmentNeeded: true,
        reconciledAt: new Date('2024-10-18'),
        subscriptionScope: SCOPES.CORE,
        hasCleaSubscription: false,
      });
    });

    context('invariants', function () {
      it('should assess that evaluated candidate is always reconciled', function () {
        // given
        const reconciledAt = null;

        // when
        const error = catchErrSync(
          (reconciledAt) =>
            new Candidate({ accessibilityAdjustmentNeeded: false, reconciledAt, hasCleaSubscription: false }),
        )(reconciledAt);

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect(error.invalidAttributes).to.deep.equal([
          {
            attribute: 'reconciledAt',
            message: '"reconciledAt" must be a valid date',
          },
        ]);
      });
    });
  });

  context('#get isScorable', function () {
    [
      { subscriptionScope: SCOPES.CORE, isScorable: true },
      { subscriptionScope: SCOPES.PIX_PLUS_EDU_1ER_DEGRE, isScorable: true },
      { subscriptionScope: SCOPES.PIX_PLUS_EDU_2ND_DEGRE, isScorable: true },
      { subscriptionScope: SCOPES.PIX_PLUS_EDU_CPE, isScorable: true },
      { subscriptionScope: SCOPES.PIX_PLUS_DROIT, isScorable: false },
      { subscriptionScope: SCOPES.PIX_PLUS_PRO_SANTE, isScorable: false },
    ].forEach(({ subscriptionScope, isScorable }) => {
      it(`should return ${isScorable} when candidate has subscribed to ${subscriptionScope} certification`, function () {
        const candidate = domainBuilder.certification.evaluation.buildCandidate({
          subscriptionScope: subscriptionScope,
        });

        expect(candidate.isScorable).to.equal(isScorable);
      });
    });
  });

  context('#get hasOnlyCoreSubscription', function () {
    it('should return true when candidate has solely subscribed to CORE certification', function () {
      const candidate = domainBuilder.certification.evaluation.buildCandidate({
        subscriptionScope: SCOPES.CORE,
        hasCleaSubscription: false,
      });

      expect(candidate.hasOnlyCoreSubscription).to.be.true;
    });

    it('should return false when candidate has a double subscription CORE and CLEA', function () {
      const candidate = domainBuilder.certification.evaluation.buildCandidate({
        subscriptionScope: SCOPES.CORE,
        hasCleaSubscription: true,
      });

      expect(candidate.hasOnlyCoreSubscription).to.be.false;
    });

    it('should return false when candidate has a pix plus subscription', function () {
      const candidate = domainBuilder.certification.evaluation.buildCandidate({
        subscriptionScope: SCOPES.PIX_PLUS_DROIT,
        hasCleaSubscription: false,
      });

      expect(candidate.hasOnlyCoreSubscription).to.be.false;
    });
  });
});
