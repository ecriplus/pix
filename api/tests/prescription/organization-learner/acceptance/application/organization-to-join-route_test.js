import { ORGANIZATION_FEATURE } from '../../../../../src/shared/domain/constants.js';
import { createServer, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Acceptance | Application | organization-invitation-route', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('GET /api/organizations-to-join/{code}', function () {
    context('Success cases', function () {
      it('should return organization with import details corresponding to the given code', async function () {
        // given
        const organization = databaseBuilder.factory.buildOrganization({ identityProviderForCampaigns: 'GAR' });
        databaseBuilder.factory.buildCampaign({ code: 'ABC', organizationId: organization.id });
        const importFeature = databaseBuilder.factory.buildFeature(ORGANIZATION_FEATURE.LEARNER_IMPORT);
        const organizationLearnerImportFormat = databaseBuilder.factory.buildOrganizationLearnerImportFormat({
          name: ORGANIZATION_FEATURE.LEARNER_IMPORT.FORMAT.ONDE,
          config: {
            acceptedEncoding: ['utf-8'],
            unicityColumns: ['my_column'],
            validationRules: { formats: [{ name: 'my_column', type: 'string' }] },
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
        databaseBuilder.factory.buildOrganizationFeature({
          organizationId: organization.id,
          featureId: importFeature.id,
          params: {
            organizationLearnerImportFormatId: organizationLearnerImportFormat.id,
          },
        });

        await databaseBuilder.commit();

        const options = {
          method: 'GET',
          url: '/api/organizations-to-join/ABC',
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(200);
        const expectedAttributes = {
          id: organization.id,
          name: organization.name,
          type: organization.type,
          'logo-url': organization.logoUrl,
          'is-restricted': true,
          'identity-provider': 'GAR',
          'is-reconciliation-required': true,
          'has-reconciliation-fields': true,
          'reconciliation-fields': [
            {
              name: 'COMMON_FIRSTNAME',
              'field-id': 'reconcileField2',
              position: 2,
              type: 'string',
            },
          ],
        };
        expect(response.result.data.attributes).to.deep.equal(expectedAttributes);
      });
    });
  });
});
