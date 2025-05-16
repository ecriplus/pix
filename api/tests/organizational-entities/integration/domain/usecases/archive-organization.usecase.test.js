import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import { NotFoundError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Domain | UseCase | archive-organization', function () {
  context('when the organization does exist', function () {
    it('archives the organization', async function () {
      // given
      const now = new Date('2022-02-22');
      const clock = sinon.useFakeTimers({ now, toFake: ['Date'] });
      const superAdminUser = databaseBuilder.factory.buildUser();
      const organization = databaseBuilder.factory.buildOrganization();
      await databaseBuilder.commit();

      // when
      const archivedOrganization = await usecases.archiveOrganization({
        organizationId: organization.id,
        userId: superAdminUser.id,
      });

      // then
      expect(archivedOrganization.archivedAt).to.deep.equal(now);
      expect(archivedOrganization.archivistFirstName).to.deep.equal(superAdminUser.firstName);
      expect(archivedOrganization.archivistLastName).to.deep.equal(superAdminUser.lastName);

      clock.restore();
    });
  });

  context('when the organization does not exist', function () {
    it('throws an error', async function () {
      // given
      const nonExistingOrganizationId = 123456;
      const superAdminUser = databaseBuilder.factory.buildUser();
      await databaseBuilder.commit();

      // when
      const error = await catchErr(usecases.archiveOrganization)({
        organizationId: nonExistingOrganizationId,
        userId: superAdminUser.id,
      });

      // then
      expect(error).to.be.instanceOf(NotFoundError);
    });
  });
});
