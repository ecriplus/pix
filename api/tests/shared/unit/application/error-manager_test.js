import Joi from 'joi';

import { ErrorHapiManager, ErrorRegistry } from '../../../../src/shared/application/error-manager.js';
import { EntityValidationError } from '../../../../src/shared/domain/errors.js';
import { expect } from '../../../test-helper.js';
import { hFake } from '../../../tooling/mocks/hapi.mock.js';
import { catchErr } from '../../../tooling/test-utils/error.js';

describe('Shared | Unit | Application | ErrorManager', function () {
  describe('ErrorRegistry', function () {
    it('registers and maps the error', async function () {
      // given
      const registry = new ErrorRegistry();
      class MyError extends Error {}

      // when
      registry.register([{ name: MyError.name, httpErrorFn: (error) => `Mapped error: ${error.name}` }]);
      const mapped = registry.mapToError(MyError);

      // then
      expect(mapped).to.be.equal('Mapped error: MyError');
    });

    describe('When the mapping is invalid', function () {
      it('throws a validation error on registering', async function () {
        // given
        const registry = new ErrorRegistry();

        // when
        const error = await catchErr(registry.register, registry)([{ code: 'CODE' }]);

        // then
        expect(error).to.be.instanceOf(Joi.ValidationError);
      });
    });
  });

  describe('ErrorHapiManager', function () {
    let errorManager;
    beforeEach(function () {
      const registry = new ErrorRegistry();
      errorManager = new ErrorHapiManager(registry);
    });

    it('translates EntityValidationError', async function () {
      // given
      const request = {
        state: { locale: 'en' },
        response: new EntityValidationError({
          invalidAttributes: [{ attribute: 'name', message: 'STAGE_TITLE_IS_REQUIRED' }],
        }),
      };

      // when
      const response = errorManager.handle(request, hFake);

      // then
      expect(response.statusCode).to.equal(422);
      expect(response.source).to.deep.equal({
        errors: [
          {
            detail: 'The title is required',
            source: {
              pointer: '/data/attributes/name',
            },
            status: '422',
            title: 'Invalid data attribute "name"',
          },
        ],
      });
    });

    it('translates EntityValidationError to french', async function () {
      // given
      const request = {
        state: { locale: 'fr-fr' },
        response: new EntityValidationError({
          invalidAttributes: [{ attribute: 'name', message: 'STAGE_TITLE_IS_REQUIRED' }],
        }),
      };

      // when
      const response = errorManager.handle(request, hFake);

      // then
      expect(response.statusCode).to.equal(422);
      expect(response.source).to.deep.equal({
        errors: [
          {
            detail: 'Le titre du palier est obligatoire',
            source: {
              pointer: '/data/attributes/name',
            },
            status: '422',
            title: 'Invalid data attribute "name"',
          },
        ],
      });
    });

    it('fallbacks to the message if the translation is not found', async function () {
      // given
      const request = {
        state: { locale: 'en' },
        response: new EntityValidationError({
          invalidAttributes: [{ attribute: 'name', message: 'message' }],
        }),
      };

      // when
      const response = errorManager.handle(request, hFake);

      // then
      expect(response.statusCode).to.equal(422);
      expect(response.source).to.deep.equal({
        errors: [
          {
            detail: 'message',
            source: {
              pointer: '/data/attributes/name',
            },
            status: '422',
            title: 'Invalid data attribute "name"',
          },
        ],
      });
    });

    it('fallbacks to the message if the translation is not found with special chars', async function () {
      // given
      const request = {
        state: { locale: 'en' },
        response: new EntityValidationError({
          invalidAttributes: [{ attribute: 'name', message: 'special-:{%}/_chars' }],
        }),
      };

      // when
      const response = errorManager.handle(request, hFake);

      // then
      expect(response.statusCode).to.equal(422);
      expect(response.source).to.deep.equal({
        errors: [
          {
            detail: 'special-:{%}/_chars',
            source: {
              pointer: '/data/attributes/name',
            },
            status: '422',
            title: 'Invalid data attribute "name"',
          },
        ],
      });
    });

    it('translates EntityValidationError even if invalidAttributes is undefined', async function () {
      // given
      const request = {
        state: { locale: 'en' },
        response: new EntityValidationError({
          invalidAttributes: undefined,
        }),
      };

      // when
      const response = errorManager.handle(request, hFake);

      // then
      expect(response.statusCode).to.equal(422);
      expect(response.source).to.deep.equal({ errors: [{ status: '422' }] });
    });
  });
});
