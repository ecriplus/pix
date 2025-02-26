import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import { databaseBuilder, expect, sinon } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Domain | UseCase | archive-organization', function () {
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
