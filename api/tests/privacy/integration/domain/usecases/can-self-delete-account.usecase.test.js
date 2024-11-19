import { usecases } from '../../../../../src/privacy/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Privacy | Domain | UseCase | can-self-delete-account', function () {
  context('Feature flag is disabled', function () {
    it('returns false', async function () {
      // given
      const featureToggles = { isSelfAccountDeletionEnabled: false };
      const user = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();

      // when
      const result = await usecases.canSelfDeleteAccount({ userId: user.id, featureToggles });

      // then
      expect(result).to.be.false;
    });
  });

  context('Feature flag is enabled', function () {
    it('returns true', async function () {
      // given
      const featureToggles = { isSelfAccountDeletionEnabled: true };
      const user = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();

      // when
      const result = await usecases.canSelfDeleteAccount({ userId: user.id, featureToggles });

      // then
      expect(result).to.be.true;
    });
  });
});
