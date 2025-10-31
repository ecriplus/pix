import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import NavigationButton from 'mon-pix/components/module/layout/navigation-button';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Module | NavigationButton', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when screen is desktop', function () {
    test('should display a button with an icon', async function (assert) {
      const type = 'question-yourself';
      const section = {
        type,
      };

      // when
      const screen = await render(
        <template>
          <NavigationButton @section={{section}} @isPastSection={{false}} @isCurrentSection={{false}} />
        </template>,
      );

      // then
      assert.dom(screen.getByRole('button', { name: t(`pages.modulix.section.${type}`) })).exists();
      assert.dom(screen.getByRole('img', { hidden: true })).exists();
    });

    module('when isCurrentSection and isPastSection arguments are false', function () {
      test('should disable the navigation button', async function (assert) {
        // given
        const section = {
          type: 'question-yourself',
        };

        // when
        const screen = await render(
          <template>
            <NavigationButton @section={{section}} @isPastSection={{false}} @isCurrentSection={{false}} />
          </template>,
        );

        // then
        assert.dom(screen.getByRole('button')).hasAttribute('aria-disabled', 'true');
      });
    });

    module('when isCurrentSection argument is true', function () {
      test('should enable the navigation button', async function (assert) {
        // given
        const section = {
          type: 'question-yourself',
        };

        // when
        const screen = await render(
          <template>
            <NavigationButton @section={{section}} @isPastSection={{false}} @isCurrentSection={{true}} />
          </template>,
        );

        // then
        assert.dom(screen.getByRole('button')).hasNoAttribute('aria-disabled');
      });
    });

    module('when isPactSection argument is true', function () {
      test('should enable the navigation button', async function (assert) {
        // given
        const section = {
          type: 'question-yourself',
        };

        // when
        const screen = await render(
          <template>
            <NavigationButton @section={{section}} @isPastSection={{true}} @isCurrentSection={{false}} />
          </template>,
        );

        // then
        assert.dom(screen.getByRole('button')).hasNoAttribute('aria-disabled');
      });
    });
  });

  module('when screen is mobile', function (hooks) {
    hooks.beforeEach(function () {
      class MediaServiceStub extends Service {
        isMobile = true;
        toto = true;
      }
      this.owner.register('service:media', MediaServiceStub);
    });

    test('should display a link with an icon', async function (assert) {
      // given
      const type = 'question-yourself';
      const section = {
        type,
      };

      // when
      const screen = await render(
        <template>
          <NavigationButton @section={{section}} @isPastSection={{false}} @isCurrentSection={{false}} />
        </template>,
      );

      // then
      assert.dom(screen.getByRole('link', { href: '#question-yourself' })).exists();
    });

    module('when isCurrentSection and isPastSection arguments are false', function () {
      test('should disable the navigation link', async function (assert) {
        // given
        const section = {
          type: 'question-yourself',
        };

        // when
        const screen = await render(
          <template>
            <NavigationButton @section={{section}} @isPastSection={{false}} @isCurrentSection={{false}} />
          </template>,
        );

        // then
        assert.dom(screen.getByRole('link')).hasAria('disabled', 'true');
      });
    });

    module('when isCurrentSection argument is true', function () {
      test('should enable the navigation link', async function (assert) {
        // given
        const section = {
          type: 'question-yourself',
        };

        // when
        const screen = await render(
          <template>
            <NavigationButton @section={{section}} @isPastSection={{false}} @isCurrentSection={{true}} />
          </template>,
        );

        // then
        assert.dom(screen.getByRole('link')).hasAria('disabled', 'false');
      });
    });

    module('when isPactSection argument is true', function () {
      test('should enable the navigation link', async function (assert) {
        // given
        const section = {
          type: 'question-yourself',
        };

        // when
        const screen = await render(
          <template>
            <NavigationButton @section={{section}} @isPastSection={{true}} @isCurrentSection={{false}} />
          </template>,
        );

        // then
        assert.dom(screen.getByRole('link')).hasAria('disabled', 'false');
      });
    });

    test('should set aria-current attribute to NavigationButton element', async function (assert) {
      // given
      class MediaServiceStub extends Service {
        isMobile = true;
      }
      this.owner.register('service:media', MediaServiceStub);
      const section = {
        type: 'question-yourself',
      };

      // when
      const screen = await render(
        <template>
          <NavigationButton @section={{section}} @isPastSection={{true}} @isCurrentSection={{true}} />
        </template>,
      );

      // then
      assert
        .dom(screen.getByRole('link', { name: t('pages.modulix.section.question-yourself') }))
        .hasAria('current', 'true');
    });
  });
});
