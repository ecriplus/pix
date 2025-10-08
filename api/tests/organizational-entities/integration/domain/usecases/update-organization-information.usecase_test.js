import { AdministrationTeamNotFound } from '../../../../../src/organizational-entities/domain/errors.js';
import { OrganizationForAdmin } from '../../../../../src/organizational-entities/domain/models/OrganizationForAdmin.js';
import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import {
  catchErr,
  databaseBuilder,
  domainBuilder,
  expect,
  insertMultipleSendingFeatureForNewOrganization,
} from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Domain | UseCases | update-organization', function () {
  beforeEach(async function () {
    await insertMultipleSendingFeatureForNewOrganization();
  });

  it('updates organization information', async function () {
    // given
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
    expect(updatedOrganization).to.be.instanceOf(OrganizationForAdmin);
    expect(updatedOrganization.name).to.equal("Nouveau nom d'organization");
    expect(updatedOrganization.administrationTeamId).to.equal(newAdministrationTeamId);
  });

  context('when administration team does not exist', function () {
    it('throws an AdministrationTeamNotFound error', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;

      await databaseBuilder.commit();

      const organizationNewInformations = domainBuilder.buildOrganizationForAdmin({
        id: organizationId,
        administrationTeamId: 123,
      });

      // when
      const error = await catchErr(usecases.updateOrganizationInformation)({
        organization: organizationNewInformations,
      });

      // then
      expect(error).to.be.instanceOf(AdministrationTeamNotFound);
    });
  });
});
