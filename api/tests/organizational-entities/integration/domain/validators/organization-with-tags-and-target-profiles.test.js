import { Organization } from '../../../../../src/organizational-entities/domain/models/Organization.js';
import { validate } from '../../../../../src/organizational-entities/domain/validators/organization-with-tags-and-target-profiles.js';
import { EntityValidationError } from '../../../../../src/shared/domain/errors.js';
import { getSupportedLocales } from '../../../../../src/shared/domain/services/locale-service.js';
import { catchErrSync, expect } from '../../../../test-helper.js';

const organizationTypes = [...Object.values(Organization.types)];
const lowerCaseSupportedLocales = getSupportedLocales().map((supportedLocale) => supportedLocale.toLocaleLowerCase());

describe('Unit | Domain | Validators | organization-with-tags-and-target-profiles-script.js', function () {
  const DEFAULT_ORGANIZATION = {
    createdBy: 1234,
    credit: 0,
    externalId: 'EXT_ID_123',
    locale: 'fr-fr',
    name: 'Orga Name',
    provinceCode: '123',
    tags: 'TAG1',
    type: 'SCO',
    administrationTeamId: 1,
    countryCode: 99123,
  };

  context('success', function () {
    lowerCaseSupportedLocales.forEach((locale) => {
      context(`when locale is ${locale}`, function () {
        it('returns true', function () {
          // given
          const organization = {
            ...DEFAULT_ORGANIZATION,
            locale,
          };

          // when
          const result = validate(organization);

          // then
          expect(result).to.be.true;
        });
      });
    });

    context('when all required properties are provided', function () {
      organizationTypes.forEach((organizationType) => {
        context(`when organization type is ${organizationType}`, function () {
          it('returns "true"', function () {
            // given
            const organization = {
              type: organizationType,
              externalId: 'EXTERNAL_ID',
              name: 'Organization Name',
              createdBy: 0,
              administrationTeamId: 1,
              countryCode: 99123,
            };

            // when
            const result = validate(organization);

            // then
            expect(result).to.be.true;
          });
        });
      });
    });
  });

  context('error', function () {
    context('when one of or all required properties is not provided', function () {
      it('returns an EntityValidation error', function () {
        // given
        const organization = {};

        // when
        const error = catchErrSync(validate)(organization);

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect(error.message).to.equal(`Échec de validation de l'entité.`);
        expect(error.invalidAttributes).to.have.deep.members([
          { attribute: 'type', message: '"type" is required' },
          { attribute: 'externalId', message: '"externalId" is required' },
          { attribute: 'name', message: '"name" is required' },
          { attribute: 'createdBy', message: "L'id du créateur est manquant" },
          { attribute: 'administrationTeamId', message: "L'id de l'équipe en charge est manquant" },
          { attribute: 'countryCode', message: 'Le code pays n’est pas renseigné.' },
        ]);
      });
    });

    context(`when locale is not supported`, function () {
      it('returns an EntityValidation error', function () {
        // given
        const organization = {
          ...DEFAULT_ORGANIZATION,
          locale: 'pt-br',
        };

        // when
        const error = catchErrSync(validate)(organization);

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect(error.message).to.equal(`Échec de validation de l'entité.`);
        expect(error.invalidAttributes).to.deep.include({
          attribute: 'locale',
          message: `La locale doit avoir l'une des valeurs suivantes : en, es, es-419, fr, nl, fr-be, fr-fr, nl-be`,
        });
      });
    });

    context('countryCode validation', function () {
      it('returns a required error when countryCode is null', function () {
        // given
        const organization = {
          ...DEFAULT_ORGANIZATION,
          countryCode: null,
        };

        // when
        const error = catchErrSync(validate)(organization);

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect(error.message).to.equal(`Échec de validation de l'entité.`);
        expect(error.invalidAttributes).to.deep.include({
          attribute: 'countryCode',
          message: 'Le code pays n’est pas renseigné.',
        });
      });

      it('returns an EntityValidation error when country code is below minimum value', function () {
        // given
        const organization = {
          ...DEFAULT_ORGANIZATION,
          countryCode: 98000,
        };

        // when
        const error = catchErrSync(validate)(organization);

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect(error.message).to.equal(`Échec de validation de l'entité.`);
        expect(error.invalidAttributes).to.deep.include({
          attribute: 'countryCode',
          message: 'Le code pays doit être un nombre entier compris entre 99000 et 99999.',
        });
      });

      it('returns an EntityValidation error when country code is above maximum value', function () {
        // given
        const organization = {
          ...DEFAULT_ORGANIZATION,
          countryCode: 100000,
        };

        // when
        const error = catchErrSync(validate)(organization);

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect(error.message).to.equal(`Échec de validation de l'entité.`);
        expect(error.invalidAttributes).to.deep.include({
          attribute: 'countryCode',
          message: 'Le code pays doit être un nombre entier compris entre 99000 et 99999.',
        });
      });
    });

    context('createdBy validation', function () {
      it('returns a required error when createdBy is null', function () {
        // given
        const organization = {
          ...DEFAULT_ORGANIZATION,
          createdBy: null,
        };

        // when
        const error = catchErrSync(validate)(organization);

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect(error.message).to.equal(`Échec de validation de l'entité.`);
        expect(error.invalidAttributes).to.deep.include({
          attribute: 'createdBy',
          message: "L'id du créateur est manquant",
        });
      });
    });

    context('administrationTeamId validation', function () {
      it('returns a required error when administrationTeamId is null', function () {
        // given
        const organization = {
          ...DEFAULT_ORGANIZATION,
          administrationTeamId: null,
        };

        // when
        const error = catchErrSync(validate)(organization);

        // then
        expect(error).to.be.instanceOf(EntityValidationError);
        expect(error.message).to.equal(`Échec de validation de l'entité.`);
        expect(error.invalidAttributes).to.deep.include({
          attribute: 'administrationTeamId',
          message: "L'id de l'équipe en charge est manquant",
        });
      });
    });
  });
});
