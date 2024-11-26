import * as userApi from '../../../../../src/privacy/application/api/users-api.js';
import { usecases } from '../../../../../src/privacy/domain/usecases/index.js';
import { databaseBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Integration | Privacy | Application | Api | users', function () {
  describe('#canSelfDeleteAccount', function () {
    it('indicates if a user can self delete their account', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      const usecaseStub = sinon.stub(usecases, 'canSelfDeleteAccount');
      usecaseStub.resolves(true);

      // when
      const result = await userApi.canSelfDeleteAccount({ userId });

      // then
      expect(usecaseStub).to.have.been.calledWith({ userId });
      expect(result).to.equal(true);
    });
  });
});
