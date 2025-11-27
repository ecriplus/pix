import { OrganizationBatchUpdateDTO } from '../../../../../src/organizational-entities/domain/dtos/OrganizationBatchUpdateDTO.js';
import { OrganizationBatchUpdateError } from '../../../../../src/organizational-entities/domain/errors.js';
import { updateOrganizationsInBatch } from '../../../../../src/organizational-entities/domain/usecases/update-organizations-in-batch.usecase.js';
import { DomainTransaction } from '../../../../../src/shared/domain/DomainTransaction.js';
import { catchErr, createTempFile, domainBuilder, expect, removeTempFile, sinon } from '../../../../test-helper.js';

describe('Unit | Organizational Entities | Domain | UseCase | update-organizations-in-batch', function () {
  let filePath, organizationForAdminRepository, administrationTeamRepository, countryRepository;

  const csvHeaders =
    'Organization ID;Organization Name;Organization External ID;Organization Parent ID;Organization Identity Provider Code;Organization Documentation URL;Organization Province Code;DPO Last Name;DPO First Name;DPO E-mail;Administration Team ID;Country Code';

  beforeEach(function () {
    sinon.stub(DomainTransaction, 'execute').callsFake((callback) => {
      return callback();
    });

    organizationForAdminRepository = {
      get: sinon.stub(),
      update: sinon.stub(),
      exist: sinon.stub(),
    };

    countryRepository = {
      getByCode: sinon.stub().resolves(domainBuilder.buildCountry({ code: '99100' })),
    };

    administrationTeamRepository = {
      getById: sinon.stub().resolves(domainBuilder.buildAdministrationTeam({ id: 1234 })),
    };
  });

  afterEach(async function () {
    sinon.restore();

    if (filePath) {
      await removeTempFile(filePath);
    }
  });

  context('when parsing a CSV file without organization', function () {
    it('does nothing', async function () {
      // given
      const fileData = `${csvHeaders}`;
      filePath = await createTempFile('test.csv', fileData);

      // when
      await updateOrganizationsInBatch({ filePath, organizationForAdminRepository, administrationTeamRepository });

      // then
      expect(DomainTransaction.execute).to.not.have.been.called;
      expect(organizationForAdminRepository.get).to.not.have.been.called;
      expect(organizationForAdminRepository.update).to.not.have.been.called;
    });
  });

  context('when parsing a CSV file which contains a list of organizations to update', function () {
    let csvData;

    beforeEach(async function () {
      const fileData = `${csvHeaders}
      1;;12;;OIDC_EXAMPLE_NET;https://doc.url;;Troisjour;Adam;foo@email.com;1234;99100
      2;New Name;;;;;;;Cali;;5678;99100`;
      filePath = await createTempFile('test.csv', fileData);
      csvData = [
        new OrganizationBatchUpdateDTO({
          id: '1',
          externalId: '12',
          identityProviderForCampaigns: 'OIDC_EXAMPLE_NET',
          documentationUrl: 'https://doc.url',
          dataProtectionOfficerLastName: 'Troisjour',
          dataProtectionOfficerFirstName: 'Adam',
          dataProtectionOfficerEmail: 'foo@email.com',
          administrationTeamId: '1234',
          countryCode: '99100',
        }),
        new OrganizationBatchUpdateDTO({
          id: '2',
          name: 'New Name',
          dataProtectionOfficerFirstName: 'Cali',
          administrationTeamId: '5678',
          countryCode: '99100',
        }),
      ];
    });

    it('calls n times "organizationForAdminRepository.get" to retrieve an organization', async function () {
      // given
      organizationForAdminRepository.exist.resolves(true);
      organizationForAdminRepository.get.onCall(0).resolves(domainBuilder.buildOrganizationForAdmin({ id: 1 }));
      organizationForAdminRepository.get.onCall(1).resolves(domainBuilder.buildOrganizationForAdmin({ id: 2 }));

      // when
      await updateOrganizationsInBatch({
        filePath,
        organizationForAdminRepository,
        administrationTeamRepository,
        countryRepository,
      });

      // then
      expect(DomainTransaction.execute).to.have.been.called;
      expect(organizationForAdminRepository.get).to.have.been.callCount(2);
      expect(organizationForAdminRepository.get.getCall(0)).to.have.been.calledWithExactly({ organizationId: '1' });
      expect(organizationForAdminRepository.get.getCall(1)).to.have.been.calledWithExactly({ organizationId: '2' });
    });

    it('calls n times "organizationForAdminRepository.update" to update an organization', async function () {
      // given
      const firstOrganization = domainBuilder.buildOrganizationForAdmin({ id: 1 });
      const secondOrganization = domainBuilder.buildOrganizationForAdmin({ id: 2 });
      organizationForAdminRepository.exist.resolves(true);
      organizationForAdminRepository.get.onCall(0).resolves(firstOrganization);
      organizationForAdminRepository.get.onCall(1).resolves(secondOrganization);

      const expectedFirstOrganization = domainBuilder.buildOrganizationForAdmin({ id: 1 });
      expectedFirstOrganization.updateFromOrganizationBatchUpdateDto(csvData[0]);
      const expectedSecondOrganization = domainBuilder.buildOrganizationForAdmin({ id: 2 });
      expectedSecondOrganization.updateFromOrganizationBatchUpdateDto(csvData[1]);

      // when
      await updateOrganizationsInBatch({
        filePath,
        organizationForAdminRepository,
        administrationTeamRepository,
        countryRepository,
      });

      // then
      expect(DomainTransaction.execute).to.have.been.called;
      expect(organizationForAdminRepository.update).to.have.been.callCount(2);
      expect(organizationForAdminRepository.update.getCall(0)).to.have.been.calledWithExactly({
        organization: expectedFirstOrganization,
      });
      expect(organizationForAdminRepository.update.getCall(1)).to.have.been.calledWithExactly({
        organization: expectedSecondOrganization,
      });
    });
  });

  context('when CSV files contains some errors in the list of organizations to update', function () {
    context('when an unexpected error happens', function () {
      it('throws an OrganizationBatchUpdateError', async function () {
        // given
        const fileData = `${csvHeaders}
        1;;12;2;OIDC_EXAMPLE_NET;https://doc.url;;Troisjour;Adam;;1234;
        `;
        filePath = await createTempFile('test.csv', fileData);
        organizationForAdminRepository.exist.resolves(true);
        organizationForAdminRepository.get.onCall(0).resolves(domainBuilder.buildOrganizationForAdmin({ id: 1 }));
        organizationForAdminRepository.update.rejects('Unexpected error');

        // when
        const error = await catchErr(updateOrganizationsInBatch)({
          filePath,
          organizationForAdminRepository,
          administrationTeamRepository,
          countryRepository,
        });

        // then
        expect(error).to.be.instanceOf(OrganizationBatchUpdateError);
        expect(error.message).to.equal('Organization batch update failed');
        expect(error.meta.organizationId).to.equal('1');
      });
    });
  });
});
