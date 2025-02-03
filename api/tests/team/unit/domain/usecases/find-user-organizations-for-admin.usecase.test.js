import { findUserOrganizationsForAdmin } from '../../../../../src/team/domain/usecases/find-user-organizations-for-admin.usecase.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Team | Domain | UseCase | findUserOrganizationsForAdmin', function () {
  it('fetches user’s organization memberships', async function () {
    const userId = 1;

    const userOrganizationsForAdminRepository = {
      findByUserId: sinon.stub(),
    };
    const expectedOrganizationMemberships = ['A dummy value to check that function is called with good params'];
    userOrganizationsForAdminRepository.findByUserId.withArgs(userId).resolves(expectedOrganizationMemberships);

    const foundOrganizationMemberships = await findUserOrganizationsForAdmin({
      userId,
      userOrganizationsForAdminRepository,
    });

    expect(foundOrganizationMemberships).to.deep.equal(expectedOrganizationMemberships);
  });
});
