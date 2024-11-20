import { canSelfDeleteAccount } from '../../../../../src/privacy/application/api/users-api.js';
import { usecases } from '../../../../../src/privacy/domain/usecases/index.js';
import { expect, sinon } from '../../../../test-helper.js';

describe('Unit | Privacy | Application | Api | users', function () {
  describe('#canSelfDeleteAccount', function () {
    it('indicates if a user can self delete an account', async function () {
      // given
      const userId = Symbol('123');

      sinon.stub(usecases, 'canSelfDeleteAccount');
      usecases.canSelfDeleteAccount.withArgs({ userId }).resolves(true);

      // when
      const result = await canSelfDeleteAccount({ userId });

      // then
      expect(result).to.equal(true);
    });
  });
});
