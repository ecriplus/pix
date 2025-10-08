import { AdministrationTeamNotFound } from '../../../../../src/organizational-entities/domain/errors.js';
import { Organization } from '../../../../../src/organizational-entities/domain/models/Organization.js';
import { OrganizationForAdmin } from '../../../../../src/organizational-entities/domain/models/OrganizationForAdmin.js';
import { usecases } from '../../../../../src/organizational-entities/domain/usecases/index.js';
import { EntityValidationError } from '../../../../../src/shared/domain/errors.js';
import {
  catchErr,
  databaseBuilder,
  expect,
  insertMultipleSendingFeatureForNewOrganization,
  insertPixJuniorFeatureForNewOrganization,
} from '../../../../test-helper.js';

describe('Integration | UseCases | create-organization', function () {
  let superAdminUserId;

  beforeEach(async function () {
    superAdminUserId = databaseBuilder.factory.buildUser().id;
    databaseBuilder.factory.buildAdministrationTeam({ id: 1234, name: 'Équipe 1' });
    await insertMultipleSendingFeatureForNewOrganization();
    await databaseBuilder.commit();
  });

  it('returns newly created organization', async function () {
    // given
    const organization = new OrganizationForAdmin({
      name: 'ACME',
      type: 'PRO',
      documentationUrl: 'https://pix.fr',
      createdBy: superAdminUserId,
      administrationTeamId: 1234,
    });

    // when
    const createdOrganization = await usecases.createOrganization({ organization });

    // then
    expect(createdOrganization).to.be.instanceOf(OrganizationForAdmin);
    expect(createdOrganization.createdBy).to.be.equal(superAdminUserId);
    expect(createdOrganization.name).to.be.equal(organization.name);
    expect(createdOrganization.type).to.be.equal(organization.type);
    expect(createdOrganization.documentationUrl).to.be.equal(organization.documentationUrl);
    expect(createdOrganization.dataProtectionOfficer.firstName).to.equal('');
    expect(createdOrganization.dataProtectionOfficer.lastName).to.equal('');
    expect(createdOrganization.dataProtectionOfficer.email).to.equal('');
  });

  describe('error cases', function () {
    describe('when organization administration team does not exist', function () {
      it('throws AdministrationTeamNotFound error', async function () {
        // given
        const organization = new OrganizationForAdmin({
          name: 'ACME',
          type: 'PRO',
          documentationUrl: 'https://pix.fr',
          createdBy: superAdminUserId,
          administrationTeamId: 9999,
        });

        // when
        const error = await catchErr(usecases.createOrganization)({ organization });

        // then
        expect(error).to.deep.equal(
          new AdministrationTeamNotFound({
            meta: { administrationTeamId: organization.administrationTeamId },
          }),
        );
      });
    });

    context('when params are not valid', function () {
      it('rejects an EntityValidationError', async function () {
        // given
        const organization = new OrganizationForAdmin({
          name: 'ACME',
          type: 'PRO',
        });

        // when
        const error = await catchErr(usecases.createOrganization)({ organization });

        // then
        expect(error).to.be.an.instanceOf(EntityValidationError);
      });
    });
  });

  describe('junior organization', function () {
    it('returns newly created organization', async function () {
      // given
      await insertPixJuniorFeatureForNewOrganization();

      const organization = new OrganizationForAdmin({
        name: 'ACME',
        type: Organization.types.SCO1D,
        documentationUrl: 'https://pix.fr',
        createdBy: superAdminUserId,
        administrationTeamId: 1234,
      });

      // when
      const createdOrganization = await usecases.createOrganization({ organization });
      // then
      expect(createdOrganization).to.be.instanceOf(OrganizationForAdmin);
      expect(createdOrganization.createdBy).to.be.equal(superAdminUserId);
      expect(createdOrganization.name).to.be.equal(organization.name);
      expect(createdOrganization.type).to.be.equal(organization.type);
      expect(createdOrganization.documentationUrl).to.be.equal(organization.documentationUrl);
      expect(createdOrganization.dataProtectionOfficer.firstName).to.equal('');
      expect(createdOrganization.dataProtectionOfficer.lastName).to.equal('');
      expect(createdOrganization.dataProtectionOfficer.email).to.equal('');
    });
  });
});
