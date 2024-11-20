import { canSelfDeleteAccount } from '../../../../../src/identity-access-management/infrastructure/repositories/privacy-users-api.repository.js';
import { expect } from '../../../../test-helper.js';

describe('Unit | Identity Access Management | Infrastructure | Repositories | privacy-users-api', function () {
  describe('#canSelfDeleteAccount', function () {
    it('indicates if user can self delete their account', async function () {
      // given
      const dependencies = {
        privacyUsersApi: {
          canSelfDeleteAccount: async () => true,
        },
      };

      // when
      const result = await canSelfDeleteAccount({ userId: '123', dependencies });

      // then
      expect(result).to.be.true;
    });
  });
});
