import { usecases } from '../../../../../src/identity-access-management/domain/usecases/index.js';
import { featureToggles } from '../../../../../src/shared/infrastructure/feature-toggles/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Identity Access Management  | Domain | Usecases | get-user-account-info', function () {
  it('returns user account info', async function () {
    // given
    await featureToggles.set('isSelfAccountDeletionEnabled', false);
    const user = databaseBuilder.factory.buildUser();
    await databaseBuilder.commit();

    // when
    const userAccountInfo = await usecases.getUserAccountInfo({ userId: user.id });

    // then
    expect(userAccountInfo).to.deep.equal({
      id: user.id,
      email: user.email,
      username: user.username,
      canSelfDeleteAccount: false,
    });
  });
});
