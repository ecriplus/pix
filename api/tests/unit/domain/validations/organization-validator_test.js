const { expect } = require('../../../test-helper');
const organizationValidator = require('../../../../lib/domain/validators/organization-validator');
const { OrganizationValidationErrors } = require('../../../../lib/domain/errors');

const MISSING_VALUE = '';

function _assertErrorMatchesWithExpectedOne(err, expectedError) {
  expect(err).to.be.an.instanceof(OrganizationValidationErrors);
  expect(err.errors).to.have.lengthOf(1);
  expect(err.errors[0]).to.deep.equal(expectedError);
}

describe('Unit | Domain | Validators | organization-validator', function() {

  let organizationData;

  beforeEach(() => {
    organizationData = {
      code: 'AZER42',
      name: 'Lycée des Rosiers',
      type: 'SUP',
      email: 'lycee.des.rosiers@example.net'
    };
  });

  describe('#validate', () => {

    context('when validation is successful', () => {

      it('should resolve (with no value) when validation is successful', () => {
        // when
        const promise = organizationValidator.validate(organizationData);

        // then
        return expect(promise).to.be.fulfilled;
      });
    });

    context('when organization data validation fails', () => {

      context('on code attribute', () => {

        it('should reject with error when code is missing', () => {
          // given
          const expectedError = {
            source: { pointer: '/data/attributes/code' },
            title: 'Invalid organization data attribute "code"',
            detail: 'Le code n’est pas renseigné.',
            meta: {
              field: 'code'
            }
          };
          organizationData.code = MISSING_VALUE;

          // when
          const promise = organizationValidator.validate(organizationData);

          // then
          return promise
            .then(() => expect.fail('Expected rejection with OrganizationValidationErrors'))
            .catch((err) => _assertErrorMatchesWithExpectedOne(err, expectedError));
        });

        it('should reject with error when code has wrong format', () => {
          // given
          const expectedError = {
            source: { pointer: '/data/attributes/code' },
            title: 'Invalid organization data attribute "code"',
            detail: 'Le code doit respecter le format AAAA99.',
            meta: {
              field: 'code'
            }
          };
          organizationData.code = 'AZ32RET22';

          // when
          const promise = organizationValidator.validate(organizationData);

          // then
          return promise
            .then(() => expect.fail('Expected rejection with OrganizationValidationErrors'))
            .catch((err) => _assertErrorMatchesWithExpectedOne(err, expectedError));
        });

      });

      context('on name attribute', () => {

        it('should reject with error when name is missing', () => {
          // given
          const expectedError = {
            source: { pointer: '/data/attributes/name' },
            title: 'Invalid organization data attribute "name"',
            detail: 'Le nom n’est pas renseigné.',
            meta: {
              field: 'name'
            }
          };
          organizationData.name = MISSING_VALUE;

          // when
          const promise = organizationValidator.validate(organizationData);

          // then
          return promise
            .then(() => expect.fail('Expected rejection with OrganizationValidationErrors'))
            .catch((err) => _assertErrorMatchesWithExpectedOne(err, expectedError));
        });

      });

      context('on email attribute', () => {

        it('should reject with error when email is missing', () => {
          // given
          const expectedError = {
            source: { pointer: '/data/attributes/email' },
            title: 'Invalid organization data attribute "email"',
            detail: 'L’adresse électronique n’est pas renseignée.',
            meta: {
              field: 'email'
            }
          };
          organizationData.email = MISSING_VALUE;

          // when
          const promise = organizationValidator.validate(organizationData);

          // then
          return promise
            .then(() => expect.fail('Expected rejection with OrganisationValidationErrors'))
            .catch((err) => _assertErrorMatchesWithExpectedOne(err, expectedError));
        });

        it('should reject with error when email is invalid', () => {
          // given
          const expectedError = {
            source: { pointer: '/data/attributes/email' },
            title: 'Invalid organization data attribute "email"',
            detail: 'L’adresse électronique n’est pas correcte.',
            meta: {
              field: 'email'
            }
          };
          organizationData.email = 'invalid_email';

          // when
          const promise = organizationValidator.validate(organizationData);

          // then
          return promise
            .then(() => expect.fail('Expected rejection with OrganizationValidationErrors'))
            .catch((err) => _assertErrorMatchesWithExpectedOne(err, expectedError));
        });

      });

      context('on type attribute', () => {

        it('should reject with error when type is missing', () => {
          // given
          const expectedError = {
            source: { pointer: '/data/attributes/type' },
            title: 'Invalid organization data attribute "type"',
            detail: 'Le type n’est pas renseigné.',
            meta: {
              field: 'type'
            }
          };
          organizationData.type = MISSING_VALUE;

          // when
          const promise = organizationValidator.validate(organizationData);

          // then
          return promise
            .then(() => expect.fail('Expected rejection with OrganizationValidationErrors'))
            .catch((err) => _assertErrorMatchesWithExpectedOne(err, expectedError));
        });

        it('should reject with error when type value is not SUP, SCO or PRO', () => {
          // given
          const expectedError = {
            source: { pointer: '/data/attributes/type' },
            title: 'Invalid organization data attribute "type"',
            detail: 'Le type doit avoir l’une des valeurs suivantes: SCO, SUP, PRO.',
            meta: {
              field: 'type'
            }
          };
          organizationData.type = 'PTT';

          // when
          const promise = organizationValidator.validate(organizationData);

          // then
          return promise
            .then(() => expect.fail('Expected rejection with OrganizationValidationErrors'))
            .catch((err) => _assertErrorMatchesWithExpectedOne(err, expectedError));
        });

        [
          'SUP',
          'SCO',
          'PRO'
        ].forEach(function(type) {
          it(`should accept ${type} as type`, function() {
            // given
            organizationData.type = type;

            // when
            const promise = organizationValidator.validate(organizationData);

            // then
            return expect(promise).to.be.fulfilled;
          });
        });

      });

      it('should reject with errors on all fields (but only once by field) when all fields are missing', () => {
        // given
        organizationData = {
          code: '',
          name: '',
          email: '',
          type: '',
        };

        // when
        const promise = organizationValidator.validate(organizationData);

        // then
        return promise
          .then(() => expect.fail('Expected rejection with UserValidationErrors'))
          .catch((err) => {
            expect(err).to.be.an.instanceof(OrganizationValidationErrors);
            expect(err.errors).to.have.lengthOf(4);
          });
      });
    });
  });
});
