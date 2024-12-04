import { getAccountRecoveryDetails } from '../../../../../src/identity-access-management/domain/usecases/get-account-recovery-details.usecase.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Identity Access Management | Domain | UseCase | get-account-recovery-details', function () {
  it('returns new email and firstName of account recovery demand', async function () {
    // given
    const temporaryKey = 'ZHABCDEFJSJ';
    const prescriptionOrganizationLearnerRepository = {
      getLearnerInfo: sinon.stub(),
    };
    const scoAccountRecoveryService = {
      retrieveAndValidateAccountRecoveryDemand: sinon.stub(),
    };
    const organizationLearnerId = '4321';
    const newEmail = 'newemail@example.net';
    const firstName = 'Emma';

    scoAccountRecoveryService.retrieveAndValidateAccountRecoveryDemand.resolves({ organizationLearnerId, newEmail });
    prescriptionOrganizationLearnerRepository.getLearnerInfo.withArgs(organizationLearnerId).resolves({ firstName });

    // when
    const result = await getAccountRecoveryDetails({
      temporaryKey,
      prescriptionOrganizationLearnerRepository,
      scoAccountRecoveryService,
    });

    // then
    expect(result.email).to.be.equal(newEmail);
    expect(result.firstName).to.be.equal(firstName);
  });
});
