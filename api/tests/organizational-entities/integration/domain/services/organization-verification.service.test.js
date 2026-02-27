import {
  CountryNotFoundError,
  OrganizationLearnerTypeNotFound,
} from '../../../../../src/organizational-entities/domain/errors.js';
import * as organizationVerificationService from '../../../../../src/organizational-entities/domain/services/organization-verification.service.js';
import * as organizationLearnerTypeRepository from '../../../../../src/organizational-entities/infrastructure/repositories/organization-learner-type-repository.js';
import * as countryRepository from '../../../../../src/shared/infrastructure/repositories/country-repository.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Organizational Entities | Domain | Services | organization-verification', function () {
  describe('#checkCountryExists', function () {
    describe('when the country exists', function () {
      it('does not throw an error', async function () {
        // given
        const country = databaseBuilder.factory.buildCertificationCpfCountry({
          code: '99425',
          commonName: 'COUNTRY',
          originalName: 'COUNTRY',
        });
        await databaseBuilder.commit();

        // then
        await expect(organizationVerificationService.checkCountryExists(country.code, countryRepository)).not.to.be
          .rejected;
      });
    });

    describe('when the country does not exist', function () {
      it('throws an error', async function () {
        // given
        const unknownCountryCode = 99000;

        // when
        const error = await catchErr(organizationVerificationService.checkCountryExists)(
          unknownCountryCode,
          countryRepository,
        );

        // then
        expect(error).to.deepEqualInstance(
          new CountryNotFoundError({
            message: `Country not found for code ${unknownCountryCode}`,
            meta: { countryCode: unknownCountryCode },
          }),
        );
      });
    });
  });

  describe('#checkOrganizationLearnerTypeExists', function () {
    describe('when the organization learner exists', function () {
      it('does not throw an error', async function () {
        // given
        const organizationLearnerType = databaseBuilder.factory.buildOrganizationLearnerType({
          id: 123,
        });
        await databaseBuilder.commit();

        // then
        await expect(
          organizationVerificationService.checkOrganizationLearnerTypeExists(
            organizationLearnerType.id,
            organizationLearnerTypeRepository,
          ),
        ).not.to.be.rejected;
      });
    });

    describe('when the organization learner type does not exist', function () {
      it('throws an error', async function () {
        // given
        const unknownOrganizationLearnerTypeId = 99000;

        // when
        const error = await catchErr(organizationVerificationService.checkOrganizationLearnerTypeExists)(
          unknownOrganizationLearnerTypeId,
          organizationLearnerTypeRepository,
        );

        // then
        expect(error).to.deepEqualInstance(
          new OrganizationLearnerTypeNotFound({
            message: `Organization learner type not found for id ${unknownOrganizationLearnerTypeId}`,
            meta: {
              organizationLearnerTypeId: unknownOrganizationLearnerTypeId,
            },
          }),
        );
      });
    });
  });
});
