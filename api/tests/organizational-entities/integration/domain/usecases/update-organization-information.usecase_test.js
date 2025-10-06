import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import {
  databaseBuilder,
  domainBuilder,
  expect,
  insertMultipleSendingFeatureForNewOrganization,
} from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Domain | UseCases | update-organization', function () {
  it('updates organization information', async function () {
    // given
    await insertMultipleSendingFeatureForNewOrganization();

    const organizationId = databaseBuilder.factory.buildOrganization().id;

    const newAdministrationTeamId = databaseBuilder.factory.buildAdministrationTeam().id;

    await databaseBuilder.commit();

    const organizationNewInformations = domainBuilder.buildOrganizationForAdmin({
      id: organizationId,
      name: "Nouveau nom d'organization",
      administrationTeamId: newAdministrationTeamId,
    });

    // when
    const updatedOrganization = await usecases.updateOrganizationInformation({
      organization: organizationNewInformations,
    });

    // then
    expect(updatedOrganization.name).to.equal("Nouveau nom d'organization");
    expect(updatedOrganization.administrationTeamId).to.equal(newAdministrationTeamId);
  });
});
