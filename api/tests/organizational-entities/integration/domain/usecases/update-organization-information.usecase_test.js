import {
  AdministrationTeamNotFound,
  CountryNotFoundError,
  OrganizationLearnerTypeNotFound,
} from '../../../../../src/organizational-entities/domain/errors.js';
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

    const newOrganizationLearnerType = databaseBuilder.factory.buildOrganizationLearnerType({
      id: 1,
      name: 'New Type',
    });

    const newCountry = databaseBuilder.factory.buildCertificationCpfCountry({
      code: 99102,
      originalName: 'Islande',
      commonName: 'Islande',
    });

    await databaseBuilder.commit();

    const organizationNewInformation = domainBuilder.buildOrganizationForAdmin({
      id: organizationId,
      name: "Nouveau nom d'organization",
      administrationTeamId: newAdministrationTeamId,
      countryCode: newCountry.code,
      organizationLearnerType: domainBuilder.acquisition.buildOrganizationLearnerType({
        id: null,
        name: newOrganizationLearnerType.name,
      }),
    });

    // when
    const updatedOrganization = await usecases.updateOrganizationInformation({
      organization: organizationNewInformation,
    });

    // then
    expect(updatedOrganization).to.be.instanceOf(OrganizationForAdmin);
    expect(updatedOrganization.name).to.equal("Nouveau nom d'organization");
    expect(updatedOrganization.administrationTeamId).to.equal(newAdministrationTeamId);
    expect(updatedOrganization.countryCode).to.equal(99102);
    expect(updatedOrganization.organizationLearnerType.id).to.equal(newOrganizationLearnerType.id);
  });

  context('when organization learner type does not exist', function () {
    it('throws an OrganizationLearnerTypeNotFound error', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;

      await databaseBuilder.commit();

      const organizationNewInformations = domainBuilder.buildOrganizationForAdmin({
        id: organizationId,
        organizationLearnerType: domainBuilder.acquisition.buildOrganizationLearnerType({
          name: 'Student',
        }),
      });

      // when
      const error = await catchErr(usecases.updateOrganizationInformation)({
        organization: organizationNewInformations,
      });

      // then
      expect(error).to.be.instanceOf(OrganizationLearnerTypeNotFound);
      expect(error.meta.organizationLearnerTypeName).to.equal(organizationNewInformations.organizationLearnerType.name);
    });
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

  context('when country does not exist', function () {
    it('should throw a CountryNotFound error', async function () {
      // given
      const organization = databaseBuilder.factory.buildOrganization();

      await databaseBuilder.commit();

      const organizationNewInformations = domainBuilder.buildOrganizationForAdmin({
        id: organization.id,
        administrationTeamId: organization.administrationTeamId,
        countryCode: 123456,
      });

      // when
      const error = await catchErr(usecases.updateOrganizationInformation)({
        organization: organizationNewInformations,
      });

      // then
      expect(error).to.be.instanceOf(CountryNotFoundError);
      expect(error.message).equal('Country not found for code 123456');
      expect(error.meta.countryCode).to.equal(123456);
    });
  });

  context('when there is no new country code', function () {
    it('should not update country code', async function () {
      // given
      const initialOrganization = databaseBuilder.factory.buildOrganization();

      const newAdministrationTeamId = databaseBuilder.factory.buildAdministrationTeam().id;

      await databaseBuilder.commit();

      const organizationNewInformations = domainBuilder.buildOrganizationForAdmin({
        id: initialOrganization.id,
        administrationTeamId: newAdministrationTeamId,
        countryCode: null,
      });

      // when
      const response = await usecases.updateOrganizationInformation({
        organization: organizationNewInformations,
      });

      // then
      expect(response.countryCode).equal(initialOrganization.countryCode);
    });
  });
});
