import { render, within } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import AppNavigation from 'mon-pix/components/global/app-navigation';
import { module, test } from 'qunit';

import { stubCurrentUserService } from '../../../helpers/service-stubs';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Global | App Navigation', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('logos', function () {
    module('when it is not the french domain', function () {
      test('it should only display the Pix logo', async function (assert) {
        // given
        _stubCurrentUser(this.owner);

        // when
        const screen = await render(<template><AppNavigation /></template>);

        // then
        assert.strictEqual(screen.getAllByRole('img').length, 1);

        const homepageLink = screen.getByRole('link', { name: t('navigation.homepage') });
        const pixLogo = within(homepageLink).getByRole('img');
        assert.dom(pixLogo).exists();
      });
    });

    module('when it is the french domain', function () {
      test('it should only display the Pix logo', async function (assert) {
        // given
        _stubCurrentUser(this.owner);

        class CurrentDomainServiceStub extends Service {
          get isFranceDomain() {
            return true;
          }
        }
        this.owner.register('service:currentDomain', CurrentDomainServiceStub);

        // when
        const screen = await render(<template><AppNavigation /></template>);

        // then
        assert.strictEqual(screen.getAllByRole('img').length, 2);
      });
    });
  });

  module('links list', function () {
    test('it should always display a links list', async function (assert) {
      // given
      _stubCurrentUser(this.owner);

      // when
      const screen = await render(<template><AppNavigation /></template>);

      // then
      const nav = screen.getByLabelText('navigation principale');

      assert.dom(within(nav).getByRole('link', { name: t('navigation.main.dashboard') })).exists();
      assert.dom(within(nav).getByRole('link', { name: t('navigation.main.skills') })).exists();
      assert.dom(within(nav).getByRole('link', { name: t('navigation.main.start-certification') })).exists();
      assert.dom(within(nav).getByRole('link', { name: t('navigation.main.tutorials') })).exists();

      assert.dom(within(nav).queryByRole('link', { name: t('navigation.user.tests') })).doesNotExist();
      assert.dom(within(nav).queryByRole('link', { name: t('navigation.main.trainings') })).doesNotExist();
    });

    module('when user has started assessments', function () {
      test('it should display a specific link', async function (assert) {
        // given
        _stubCurrentUser(this.owner, { hasAssessmentParticipations: true });

        // when
        const screen = await render(<template><AppNavigation /></template>);

        // then
        const nav = screen.getByLabelText('navigation principale');
        assert.dom(within(nav).getByRole('link', { name: t('navigation.user.tests') })).exists();
      });
    });

    module('when user has recommended trainings', function () {
      test('it should display a specific link', async function (assert) {
        // given
        _stubCurrentUser(this.owner, { hasRecommendedTrainings: true });

        // when
        const screen = await render(<template><AppNavigation /></template>);

        // then
        const nav = screen.getByLabelText('navigation principale');
        assert.dom(within(nav).getByRole('link', { name: t('navigation.main.trainings') })).exists();
      });
    });
  });

  module('footer', function () {
    test('on tablet or desktop, it should display only the help link', async function (assert) {
      // given & when
      _stubCurrentUser(this.owner);

      class MediaServiceStub extends Service {
        isMobile = false;
      }
      this.owner.register('service:media', MediaServiceStub);

      const screen = await render(<template><AppNavigation /></template>);

      // then
      const footer = screen.getByRole('contentinfo');
      assert.strictEqual(footer.children.length, 1);
      assert.dom(within(footer).getByRole('link', { name: t('navigation.footer.help-center') })).exists();
    });

    test('on mobile, it should also display extra links', async function (assert) {
      // given & when
      _stubCurrentUser(this.owner);

      class MediaServiceStub extends Service {
        isMobile = true;
      }
      this.owner.register('service:media', MediaServiceStub);

      const screen = await render(<template><AppNavigation /></template>);

      // then
      const footer = screen.getByRole('contentinfo');
      assert.dom(within(footer).getByRole('link', { name: t('navigation.main.code') })).exists();
      assert.dom(within(footer).getByText('Banana Split')).exists();
      assert.dom(within(footer).getByRole('link', { name: t('navigation.user.account') })).exists();
      assert.dom(within(footer).getByRole('link', { name: t('navigation.user.sign-out') })).exists();
      assert.dom(within(footer).getByRole('link', { name: t('navigation.footer.help-center') })).exists();
    });
  });
});

function _stubCurrentUser(owner, extraArgs) {
  stubCurrentUserService(
    owner,
    {
      firstName: 'Banana',
      lastName: 'Split',
      email: 'banana.split@example.net',
      ...extraArgs,
    },
    { withStoreStubbed: false },
  );
}
