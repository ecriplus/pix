import { clickByName, render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
// eslint-disable-next-line no-restricted-imports
import { find } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import ModulixEmbed from 'mon-pix/components/module/element/embed';
import ENV from 'mon-pix/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | Embed', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display an embed with instruction', async function (assert) {
    // given
    const embed = {
      id: 'id',
      title: 'title',
      isCompletionRequired: false,
      url: 'https://example.org',
      instruction: "<p>Instruction de l'embed</p>",
      height: 800,
    };

    // when
    const screen = await render(<template><ModulixEmbed @embed={{embed}} /></template>);

    // then
    assert.ok(screen);
    const expectedIframe = screen.getByTitle(embed.title);
    assert.strictEqual(expectedIframe.getAttribute('src'), embed.url);
    assert.strictEqual(expectedIframe.style.getPropertyValue('height'), '800px');
    assert.dom(screen.getByRole('button', { name: t('pages.modulix.buttons.embed.start.ariaLabel') })).exists();
    assert.dom(screen.queryByRole('button', { name: t('pages.modulix.buttons.embed.reset.ariaLabel') })).doesNotExist();
    assert.dom(screen.getByText("Instruction de l'embed")).exists();
  });

  test('should display an embed without instruction', async function (assert) {
    // given
    const embed = {
      id: 'id',
      title: 'title',
      isCompletionRequired: false,
      url: 'https://example.org',
      height: 800,
    };

    // when
    await render(<template><ModulixEmbed @embed={{embed}} /></template>);

    // then
    assert.dom(find('.element-embed__instruction')).doesNotExist();
  });

  module('when user clicks on start button', function () {
    test('should hide start button and display reset button', async function (assert) {
      // given
      const embed = {
        id: 'id',
        title: 'title',
        isCompletionRequired: false,
        url: 'https://example.org',
        height: 800,
      };

      // when
      const screen = await render(<template><ModulixEmbed @embed={{embed}} /></template>);

      // then
      const startButtonName = t('pages.modulix.buttons.embed.start.ariaLabel');
      await clickByName(startButtonName);
      assert.dom(screen.queryByRole('button', { name: startButtonName })).doesNotExist();
      assert.dom(screen.getByRole('button', { name: t('pages.modulix.buttons.embed.reset.ariaLabel') })).exists();
    });

    test('should focus on the iframe', async function (assert) {
      // given
      const embed = {
        id: 'id',
        title: 'title',
        isCompletionRequired: false,
        url: 'https://example.org',
        height: 800,
      };
      const screen = await render(<template><ModulixEmbed @embed={{embed}} /></template>);

      // when
      await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));

      // then
      const iframe = screen.getByTitle(embed.title);
      assert.strictEqual(document.activeElement, iframe);
    });

    module('when a message is received', function () {
      module('when message data has no type property', function () {
        module('when embed requires completion', function () {
          test('should call the onAnswer method', async function (assert) {
            // given
            const embed = {
              id: 'id',
              title: 'Simulateur',
              isCompletionRequired: true,
              url: 'https://example.org',
              height: 800,
            };
            const onElementAnswerStub = sinon.stub();
            const screen = await render(
              <template><ModulixEmbed @embed={{embed}} @onAnswer={{onElementAnswerStub}} /></template>,
            );
            await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));

            // when
            const iframe = screen.getByTitle('Simulateur');
            const event = new MessageEvent('message', {
              data: { answer: 'toto', from: 'pix' },
              origin: 'https://epreuves.pix.fr',
              source: iframe.contentWindow,
            });
            window.dispatchEvent(event);

            // then
            sinon.assert.called(onElementAnswerStub);
            assert.ok(true);
          });
        });

        module('when embed does not require completion', function () {
          test('should not call the onAnswer method', async function (assert) {
            // given
            const embed = {
              id: 'id',
              title: 'Simulateur',
              isCompletionRequired: false,
              url: 'https://example.org',
              height: 800,
            };
            const onElementAnswerStub = sinon.stub();
            const screen = await render(
              <template><ModulixEmbed @embed={{embed}} @onAnswer={{onElementAnswerStub}} /></template>,
            );
            await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));

            // when
            const iframe = screen.getByTitle('Simulateur');
            const event = new MessageEvent('message', {
              data: { answer: 'toto', from: 'pix' },
              origin: 'https://epreuves.pix.fr',
              source: iframe.contentWindow,
            });
            window.dispatchEvent(event);

            // then
            sinon.assert.notCalled(onElementAnswerStub);
            assert.ok(true);
          });
        });

        module('when message has no answer', function () {
          test('should not call the onAnswer method', async function (assert) {
            // given
            const embed = {
              id: 'id',
              title: 'Simulateur',
              isCompletionRequired: true,
              url: 'https://example.org',
              height: 800,
            };
            const onElementAnswerStub = sinon.stub();
            const screen = await render(
              <template><ModulixEmbed @embed={{embed}} @onAnswer={{onElementAnswerStub}} /></template>,
            );
            await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));

            // when
            const iframe = screen.getByTitle('Simulateur');
            const event = new MessageEvent('message', {
              data: { start: 'true', from: 'pix' },
              origin: 'https://epreuves.pix.fr',
              source: iframe.contentWindow,
            });
            window.dispatchEvent(event);

            // then
            sinon.assert.notCalled(onElementAnswerStub);
            assert.ok(true);
          });
        });
      });

      module('when message data has type init', function () {
        module('when message data has enableFetchFromApi=true', function () {
          test('should call embed api proxy service', async function (assert) {
            // given
            const embed = {
              id: 'id',
              title: 'Simulateur',
              isCompletionRequired: true,
              url: 'https://example.org',
              height: 800,
            };
            const passageId = '5729837548';
            const requestsPort = new MessageChannel().port1;
            const forwardStub = sinon.stub();
            this.owner.register(
              'service:embed-api-proxy',
              {
                forward: forwardStub,
              },
              { instantiate: false },
            );
            const screen = await render(
              <template><ModulixEmbed @embed={{embed}} @passageId={{passageId}} /></template>,
            );
            await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));

            // when
            const iframe = screen.getByTitle('Simulateur');
            const event = new MessageEvent('message', {
              data: { type: 'init', from: 'pix', enableFetchFromApi: true },
              origin: 'https://epreuves.pix.fr',
              source: iframe.contentWindow,
              ports: [requestsPort],
            });
            window.dispatchEvent(event);

            // then
            sinon.assert.calledWith(forwardStub, sinon.match.object, requestsPort, `/api/passages/${passageId}/embed/`);
            assert.ok(true);
          });

          module('when is in preview mode', function () {
            test('should not call embed api proxy service', async function (assert) {
              // given
              const embed = {
                id: 'id',
                title: 'Simulateur',
                isCompletionRequired: true,
                url: 'https://example.org',
                height: 800,
              };
              const passageId = null;
              const forwardStub = sinon.stub();
              this.owner.register(
                'service:embed-api-proxy',
                {
                  forward: forwardStub,
                },
                { instantiate: false },
              );
              class PreviewModeServiceStub extends Service {
                isEnabled = true;
              }
              this.owner.register('service:modulixPreviewMode', PreviewModeServiceStub);
              const screen = await render(
                <template><ModulixEmbed @embed={{embed}} @passageId={{passageId}} /></template>,
              );
              await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));

              // when
              const iframe = screen.getByTitle('Simulateur');
              const event = new MessageEvent('message', {
                data: { type: 'init', from: 'pix', enableFetchFromApi: true },
                origin: 'https://epreuves.pix.fr',
                source: iframe.contentWindow,
              });
              window.dispatchEvent(event);

              // then
              sinon.assert.notCalled(forwardStub);
              assert.ok(true);
            });
          });
        });

        module('when message data has enableFetchFromApi=false', function () {
          test('should not call embed api proxy service', async function (assert) {
            // given
            const embed = {
              id: 'id',
              title: 'Simulateur',
              isCompletionRequired: true,
              url: 'https://example.org',
              height: 800,
            };
            const passageId = '5729837548';
            const forwardStub = sinon.stub();
            this.owner.register(
              'service:embed-api-proxy',
              {
                forward: forwardStub,
              },
              { instantiate: false },
            );
            const screen = await render(
              <template><ModulixEmbed @embed={{embed}} @passageId={{passageId}} /></template>,
            );
            await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));

            // when
            const iframe = screen.getByTitle('Simulateur');
            const event = new MessageEvent('message', {
              data: { type: 'init', from: 'pix', enableFetchFromApi: false },
              origin: 'https://epreuves.pix.fr',
              source: iframe.contentWindow,
            });
            window.dispatchEvent(event);

            // then
            sinon.assert.notCalled(forwardStub);
            assert.ok(true);
          });
        });
      });

      module('when message is not from pix', function () {
        test('should not call the onAnswer method', async function (assert) {
          // given
          const embed = {
            id: 'id',
            title: 'Simulateur',
            isCompletionRequired: true,
            url: 'https://example.org',
            height: 800,
          };
          const onElementAnswerStub = sinon.stub();
          const screen = await render(
            <template><ModulixEmbed @embed={{embed}} @onAnswer={{onElementAnswerStub}} /></template>,
          );
          await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));

          // when
          const iframe = screen.getByTitle('Simulateur');
          const event = new MessageEvent('message', {
            data: { answer: 'toto', from: 'nsa' },
            origin: 'https://epreuves.pix.fr',
            source: iframe.contentWindow,
          });
          window.dispatchEvent(event);

          // then
          sinon.assert.notCalled(onElementAnswerStub);
          assert.ok(true);
        });
      });

      module('when message origin is not allowed', function () {
        test('should not call the onAnswer method', async function (assert) {
          // given
          const embed = {
            id: 'id',
            title: 'Simulateur',
            isCompletionRequired: true,
            url: 'https://example.org',
            height: 800,
          };
          const onElementAnswerStub = sinon.stub();
          const screen = await render(
            <template><ModulixEmbed @embed={{embed}} @onAnswer={{onElementAnswerStub}} /></template>,
          );
          await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));

          // when
          const iframe = screen.getByTitle('Simulateur');
          const event = new MessageEvent('message', {
            data: { answer: 'toto', from: 'pix' },
            origin: 'https://example.org',
            source: iframe.contentWindow,
          });
          window.dispatchEvent(event);

          // then
          sinon.assert.notCalled(onElementAnswerStub);
          assert.ok(true);
        });
      });

      module('when message is not coming from current element’s iframe', function () {
        test('should not call the onAnswer method', async function (assert) {
          // given
          const embed = {
            id: 'id',
            title: 'Simulateur',
            isCompletionRequired: true,
            url: 'https://example.org',
            height: 800,
          };
          const onElementAnswerStub = sinon.stub();
          await render(<template><ModulixEmbed @embed={{embed}} @onAnswer={{onElementAnswerStub}} /></template>);
          await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));
          const otheriFrame = document.createElement('iframe');
          otheriFrame.src = 'https://example.org';

          // when
          const event = new MessageEvent('message', {
            data: { answer: 'toto', from: 'pix' },
            origin: 'https://epreuves.pix.fr',
            source: otheriFrame.contentWindow,
          });
          window.dispatchEvent(event);

          // then
          sinon.assert.notCalled(onElementAnswerStub);
          assert.ok(true);
        });
      });
    });
  });

  module('when user clicks on reset button', function () {
    test('should focus on the iframe', async function (assert) {
      // given
      const embed = {
        id: 'id',
        title: 'title',
        isCompletionRequired: false,
        url: 'https://example.org',
        height: 800,
      };
      const screen = await render(<template><ModulixEmbed @embed={{embed}} /></template>);

      // when
      await clickByName(t('pages.modulix.buttons.embed.start.ariaLabel'));
      await clickByName(t('pages.modulix.buttons.embed.reset.ariaLabel'));

      // then
      const iframe = screen.getByTitle(embed.title);
      assert.strictEqual(document.activeElement, iframe);
    });
  });

  module('when user copy pastes', function () {
    test('it should allow `clipboard-write` when the embed origin is allowed ', async function (assert) {
      // given
      const embed = {
        id: 'id',
        title: 'title',
        isCompletionRequired: false,
        url: `${ENV.APP.EMBED_ALLOWED_ORIGINS[0]}/embed-simulator.url`,
        height: 800,
      };

      // when
      await render(<template><ModulixEmbed @embed={{embed}} /></template>);

      // then
      assert.strictEqual(find('.element-embed-container__iframe').allow, 'clipboard-write');
    });
    test('it should not allow `clipboard-write` when the embed origin is not allowed', async function (assert) {
      // given
      const embed = {
        id: 'id',
        title: 'title',
        isCompletionRequired: false,
        url: `not-allowed-origin/embed-simulator.url`,
        height: 800,
      };

      // when
      await render(<template><ModulixEmbed @embed={{embed}} /></template>);

      // then
      assert.notOk(find('.element-embed-container__iframe').allow);
    });
  });
});
