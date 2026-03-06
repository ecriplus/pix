import { usecases } from '../../../../../../src/prescription/organization-learner/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../../test-helper.js';

describe('Integration | Prescription | Organization Learner | Domain | UseCase | unblockOrganizationLearnerAccount', function () {
  it('unblocks an organization learner account', async function () {
    // given
    const blockedUserId = databaseBuilder.factory.buildUser.withoutPixAuthenticationMethod().id;
    databaseBuilder.factory.buildAuthenticationMethod.withGarAsIdentityProvider({
      externalIdentifier: 'samlId',
      userId: blockedUserId,
    });
    databaseBuilder.factory.buildUserLogin({
      temporaryBlockedUntil: new Date(Date.now() + 3600 * 1000),
      userId: blockedUserId,
    });

    const organizationId = databaseBuilder.factory.buildOrganization({
      type: 'SCO',
      isManagingStudents: true,
    }).id;
    const organizationLearnerId = databaseBuilder.factory.prescription.organizationLearners.buildOrganizationLearner({
      firstName: 'Blocked',
      lastName: 'User',
      userId: blockedUserId,
      organizationId,
    }).id;

    await databaseBuilder.commit();

    // when
    const result = await usecases.unblockOrganizationLearnerAccount({ organizationId, organizationLearnerId });

    // then
    expect(result.temporaryBlockedUntil).equal(null);
    expect(result.blockedAt).equal(null);
  });
});
