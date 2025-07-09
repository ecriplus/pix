import { CHAT_STORAGE_PREFIX } from '../../../../src/llm/infrastructure/repositories/chat-repository.js';
import { featureToggles } from '../../../../src/shared/infrastructure/feature-toggles/index.js';
import { temporaryStorage } from '../../../../src/shared/infrastructure/key-value-storages/index.js';
import {
  createServer,
  databaseBuilder,
  expect,
  generateValidRequestAuthorizationHeaderForApplication,
} from '../../../test-helper.js';

const chatTemporaryStorage = temporaryStorage.withPrefix(CHAT_STORAGE_PREFIX);

describe('Acceptance | Route | llm-preview', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
    await featureToggles.set('isEmbedLLMEnabled', true);
  });

  describe('POST /api/llm/preview/chats', function () {
    beforeEach(async function () {
      await databaseBuilder.commit();
    });

    afterEach(async function () {
      await chatTemporaryStorage.flushAll();
    });

    context('when request is not authenticated', function () {
      it('should throw a 401', async function () {
        // when
        const response = await server.inject({
          method: 'POST',
          url: '/api/llm/preview/chats',
        });

        // then
        expect(response.statusCode).to.equal(401);
      });
    });

    context('when application token does not have llm-preview scope', function () {
      it('should throw a 403', async function () {
        // given
        const token = generateValidRequestAuthorizationHeaderForApplication('pix-llm', 'Pix LLM', 'wrong-scope');

        // when
        const response = await server.inject({
          method: 'POST',
          url: '/api/llm/preview/chats',
          headers: {
            authorization: `Bearer ${token}`,
          },
        });

        // then
        expect(response.statusCode).to.equal(403);
      });
    });

    context('when payload’s configuration is not valid', function () {
      it('should throw a 400', async function () {
        // given
        const token = generateValidRequestAuthorizationHeaderForApplication('pix-llm', 'Pix LLM', 'llm-preview');

        // when
        const response = await server.inject({
          method: 'POST',
          url: '/api/llm/preview/chats',
          headers: {
            authorization: `Bearer ${token}`,
          },
          payload: {
            configuration: {
              name: 'Config de test',
              challenge: {
                inputMaxChars: 1024,
                inputMaxPrompts: 5,
              },
            },
          },
        });

        // then
        expect(response.statusCode).to.equal(400);
      });
    });

    context('when isEmbedLLMEnabled feature toggle is false', function () {
      beforeEach(async function () {
        await featureToggles.set('isEmbedLLMEnabled', false);
      });

      it('should throw a 503', async function () {
        // given
        const token = generateValidRequestAuthorizationHeaderForApplication('pix-llm', 'Pix LLM', 'llm-preview');

        // when
        const response = await server.inject({
          method: 'POST',
          url: '/api/llm/preview/chats',
          headers: {
            authorization: `Bearer ${token}`,
          },
          payload: {
            configuration: {
              name: 'Config de test',
              llm: {
                historySize: 10,
              },
              challenge: {
                inputMaxChars: 1024,
                inputMaxPrompts: 5,
              },
            },
          },
        });

        // then
        expect(response.statusCode).to.equal(503);
      });
    });

    it('should throw a 201', async function () {
      // given
      const token = generateValidRequestAuthorizationHeaderForApplication('pix-llm', 'Pix LLM', 'llm-preview');

      // when
      const response = await server.inject({
        method: 'POST',
        url: '/api/llm/preview/chats',
        headers: {
          authorization: `Bearer ${token}`,
        },
        payload: {
          configuration: {
            name: 'Config de test',
            llm: {
              historySize: 10,
            },
            challenge: {
              inputMaxChars: 1024,
              inputMaxPrompts: 5,
            },
          },
        },
      });

      // then
      expect(response.statusCode).to.equal(201);
      expect(response.headers)
        .to.have.property('location')
        .that.matches(
          /^https:\/\/test\.app\.pix\/llm\/preview\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/,
        );

      expect(await chatTemporaryStorage.get(response.headers.location.split('/').at(-1))).to.deep.contain({
        configuration: {
          historySize: 10,
          inputMaxChars: 1024,
          inputMaxPrompts: 5,
        },
        hasAttachmentContextBeenAdded: false,
        messages: [],
      });
    });
  });
});
