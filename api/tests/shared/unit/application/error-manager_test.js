import { ErrorHapiManager, ErrorRegistry } from '../../../../src/shared/application/error-manager.js';
import { EntityValidationError } from '../../../../src/shared/domain/errors.js';
import { expect } from '../../../test-helper.js';
import { hFake } from '../../../tooling/mocks/hapi.mock.js';

describe('Shared | Unit | Application | ErrorManager', function () {
  let errorManager;

  beforeEach(function () {
    const registry = new ErrorRegistry();
    errorManager = new ErrorHapiManager(registry);
  });

  it('should translate EntityValidationError', async function () {
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

  it('should translate EntityValidationError to french', async function () {
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

  it('should fallback to the message if the translation is not found', async function () {
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

  it('should fallback to the message if the translation is not found with special chars', async function () {
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

  it('should translate EntityValidationError even if invalidAttributes is undefined', async function () {
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
