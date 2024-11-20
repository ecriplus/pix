import { usecases } from '../../../../../src/identity-access-management/domain/usecases/index.js';
import { config } from '../../../../../src/shared/config.js';
import { ForbiddenAccess } from '../../../../../src/shared/domain/errors.js';
import { databaseBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Integration | Identity Access Management | Domain | UseCase | self-delete-user-account', function () {
  context('when user can self delete their account', function () {
    it('doesn’t throw ForbiddenError', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      sinon.stub(config.featureToggles, 'isSelfAccountDeletionEnabled').value(true);

      // when & then
      await expect(usecases.selfDeleteUserAccount({ userId })).to.not.be.rejectedWith(ForbiddenAccess);
    });
  });

  context('when user cannot self delete their account', function () {
    it('throws ForbiddenError', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      await databaseBuilder.commit();

      sinon.stub(config.featureToggles, 'isSelfAccountDeletionEnabled').value(false);

      // when & then
      await expect(usecases.selfDeleteUserAccount({ userId })).to.be.rejectedWith(ForbiddenAccess);
    });
  });
});
