import { OrganizationLearnerImportFormat } from '../../../../../../src/prescription/learner-management/domain/models/OrganizationLearnerImportFormat.js';
import { OrganizationToJoin } from '../../../../../../src/prescription/organization-learner/domain/models/OrganizationToJoin.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Domain | Read-Models | OrganizationToJoin', function () {
  describe('for an organization with import format', function () {
    it('should return the organization with reconciliation fields and isRestricted true', function () {
      const organizationLearnerImportFormat = new OrganizationLearnerImportFormat({
        name: 'MY_TEST_EXPORT',
        fileType: 'csv',
        config: {
          acceptedEncoding: ['utf-8'],
          unicityColumns: ['firstName'],
          validationRules: {
            formats: [{ name: 'firstName', type: 'string' }],
          },
          headers: [
            {
              name: 'Prénom apprenant',
              config: {
                property: 'firstName',
                validate: {
                  type: 'string',
                  required: true,
                },
                reconcile: {
                  name: 'COMMON_FIRSTNAME',
                  fieldId: 'reconcileField2',
                  position: 2,
                },
              },
              required: true,
            },
          ],
        },
      });
      const organizationToJoin = new OrganizationToJoin({
        id: 1,
        name: 'My orga',
        type: 'PRO',
        logoUrl: 'http://pix.fr/logo.png',
        identityProvider: null,
        organizationLearnerImportFormat,
      });

      expect(organizationToJoin.isRestricted).to.equal(true);
      expect(organizationToJoin.reconciliationFields).to.deep.equal([
        {
          name: 'COMMON_FIRSTNAME',
          fieldId: 'reconcileField2',
          position: 2,
          type: 'string',
        },
      ]);
    });
  });

  describe('for an organization without import format but managing students', function () {
    it('should return the organization without reconciliation fields and isRestricted true', async function () {
      const organizationToJoin = new OrganizationToJoin({
        id: 1,
        name: 'My orga',
        type: 'PRO',
        logoUrl: 'http://pix.fr/logo.png',
        identityProvider: null,
        organizationLearnerImportFormat: null,
        isManagingStudents: true,
      });

      expect(organizationToJoin.isRestricted).to.equal(true);
      expect(organizationToJoin.reconciliationFields).to.be.undefined;
    });
  });

  describe('for an organization without learner import', function () {
    it('should return the organization without reconciliation fields and isRestricted false', async function () {
      const organizationToJoin = new OrganizationToJoin({
        id: 1,
        name: 'My orga',
        type: 'PRO',
        logoUrl: 'http://pix.fr/logo.png',
        identityProvider: null,
        organizationLearnerImportFormat: null,
        isManagingStudents: false,
      });

      expect(organizationToJoin.isRestricted).to.equal(false);
      expect(organizationToJoin.reconciliationFields).to.be.undefined;
    });
  });
});
