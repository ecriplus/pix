import { ConfigurationNotFoundError, LLMApiError } from '../../../../../src/llm/domain/errors.js';
import { Configuration } from '../../../../../src/llm/domain/models/Configuration.js';
import {
  CONFIGURATION_STORAGE_PREFIX,
  get,
} from '../../../../../src/llm/infrastructure/repositories/configuration-repository.js';
import { temporaryStorage } from '../../../../../src/shared/infrastructure/key-value-storages/index.js';
import { catchErr, expect, nock } from '../../../../test-helper.js';

const configurationTemporaryStorage = temporaryStorage.withPrefix(CONFIGURATION_STORAGE_PREFIX);

describe('LLM | Integration | Infrastructure | Repositories | configuration', function () {
  describe('#get', function () {
    afterEach(async function () {
      await configurationTemporaryStorage.flushAll();
    });

    context('error cases', function () {
      context('when configuration does not exist', function () {
        it('should throw a ConfigurationNotFoundError', async function () {
          // given
          const llmApiScope = nock('https://llm-test.pix.fr/api')
            .get('/configurations/uneConfigQuiExistePo')
            .reply(404, {});

          // when
          const err = await catchErr(get)('uneConfigQuiExistePo');

          // then
          expect(err).to.be.instanceOf(ConfigurationNotFoundError);
          expect(err.message).to.equal('The configuration of id "uneConfigQuiExistePo" does not exist');
          expect(llmApiScope.isDone()).to.be.true;
        });
      });

      context('when something went wrong when reaching LLM Api to get configuration', function () {
        it('should throw a LLMApiError', async function () {
          // given
          const llmApiScope = nock('https://llm-test.pix.fr/api')
            .get('/configurations/unIdDeConfiguration')
            .reply(422, { err: 'some error occurred' });

          // when
          const err = await catchErr(get)('unIdDeConfiguration');

          // then
          expect(err).to.be.instanceOf(LLMApiError);
          expect(err.message).to.equal(
            `Something went wrong when reaching the LLM Api : ${JSON.stringify({ err: 'some error occurred' }, undefined, 2)}`,
          );
          expect(llmApiScope.isDone()).to.be.true;
        });
      });
    });

    context('success cases', function () {
      context('when configuration is not cached', function () {
        it('should return the configuration from the LLM Api and save it in cache', async function () {
          // given
          const llmApiScope = nock('https://llm-test.pix.fr/api')
            .get('/configurations/unIdDeConfiguration')
            .reply(200, {
              llm: { historySize: 1 },
              challenge: { inputMaxChars: 2, inputMaxPrompts: 3 },
              attachment: { name: 'some_attachment_name', context: 'some attachment context' },
            });

          // when
          const configuration = await get('unIdDeConfiguration');

          // then
          const expectedConfiguration = new Configuration({
            historySize: 1,
            inputMaxChars: 2,
            inputMaxPrompts: 3,
            attachmentName: 'some_attachment_name',
            attachmentContext: 'some attachment context',
          });
          expect(configuration).to.deepEqualInstance(expectedConfiguration);
          expect(await configurationTemporaryStorage.get('unIdDeConfiguration')).to.deep.equal(configuration.toDTO());
          expect(llmApiScope.isDone()).to.be.true;
        });
      });

      context('when configuration is cached', function () {
        it('should return the configuration from the cache without having to fetch it from LLM Api', async function () {
          // given
          const llmApiScopeShouldBeCalled = nock('https://llm-test.pix.fr/api')
            .get('/configurations/unIdDeConfiguration')
            .once()
            .reply(200, {
              llm: { historySize: 1 },
              challenge: { inputMaxChars: 2, inputMaxPrompts: 3 },
              attachment: { name: 'some_attachment_name', context: 'some attachment context' },
            });
          const llmApiScopeShouldNOTBeCalled = nock('https://llm-test.pix.fr/api')
            .get('/configurations/unIdDeConfiguration')
            .twice()
            .reply(500, { err: 'I SHOULD NOT BE CALLED TWICE' });

          // when
          const configurationNotCached = await get('unIdDeConfiguration');
          const configurationCached = await get('unIdDeConfiguration');

          // then
          const expectedConfiguration = new Configuration({
            historySize: 1,
            inputMaxChars: 2,
            inputMaxPrompts: 3,
            attachmentName: 'some_attachment_name',
            attachmentContext: 'some attachment context',
          });
          expect(configurationNotCached).to.deepEqualInstance(expectedConfiguration);
          expect(configurationNotCached).to.deep.equal(configurationCached);
          expect(llmApiScopeShouldBeCalled.isDone()).to.be.true;
          expect(llmApiScopeShouldNOTBeCalled.isDone()).to.be.false;
        });
        context('when cached configuration is not versioned', function () {
          it('should return the configuration from the cache in new version format', async function () {
            // given
            await configurationTemporaryStorage.save({
              key: 'unIdDeConfiguration',
              value: {
                llm: { historySize: 1 },
                challenge: { inputMaxChars: 2, inputMaxPrompts: 3 },
                attachment: { name: 'some_attachment_name', context: 'some attachment context' },
              },
            });

            const llmApiScopeShouldNOTBeCalled = nock('https://llm-test.pix.fr/api')
              .get('/configurations/unIdDeConfiguration')
              .twice()
              .reply(500, { err: 'I SHOULD NOT BE CALLED' });

            // when
            const configurationCached = await get('unIdDeConfiguration');

            // then
            const expectedConfiguration = new Configuration({
              id: 'unIdDeConfiguration',
              historySize: 1,
              inputMaxChars: 2,
              inputMaxPrompts: 3,
              attachmentName: 'some_attachment_name',
              attachmentContext: 'some attachment context',
            });

            expect(configurationCached).to.deepEqualInstance(expectedConfiguration);
            expect(configurationCached.toDTO()).to.deep.equal(expectedConfiguration.toDTO());
            expect(llmApiScopeShouldNOTBeCalled.isDone()).to.be.false;
          });
        });
      });
    });
  });
});
