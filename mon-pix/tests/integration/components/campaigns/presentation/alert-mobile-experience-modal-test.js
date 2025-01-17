import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | Campaigns::Presentation | AlertMobileExperienceModal', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('on mobile', function (hooks) {
    let screen;

    hooks.beforeEach(async function () {
      // given
      class MediaServiceStub extends Service {
        isMobile = true;
      }
      this.owner.register('service:media', MediaServiceStub);

      //  when
      screen = await render(hbs`<Campaigns::Presentation::AlertMobileExperienceModal />`);
    });

    test('it should display a modal', async function (assert) {
      // then
      const modalTitle = await screen.findByText(t('pages.campaign-landing.alert-mobile-experience-modal.title'));
      assert.dom(modalTitle).exists();
      assert
        .dom(screen.getByText(t('pages.campaign-landing.alert-mobile-experience-modal.content.paragraph1')))
        .exists();
      assert
        .dom(screen.getByText(t('pages.campaign-landing.alert-mobile-experience-modal.content.paragraph2')))
        .exists();
      assert
        .dom(
          screen.getByRole('button', {
            name: t('pages.campaign-landing.alert-mobile-experience-modal.actions.continue'),
          }),
        )
        .exists();
      assert
        .dom(screen.getByRole('link', { name: t('pages.campaign-landing.alert-mobile-experience-modal.actions.back') }))
        .exists();
    });

    module('close action', function () {
      test('it should be possible to close the modal clicking on continue action', async function (assert) {
        // when
        await click(
          screen.getByRole('button', {
            name: t('pages.campaign-landing.alert-mobile-experience-modal.actions.continue'),
          }),
        );

        // then
        assert.ok(
          screen
            .getByText(t('pages.campaign-landing.alert-mobile-experience-modal.title'))
            .closest('.pix-modal__overlay')
            .classList.toString()
            .includes('pix-modal__overlay--hidden'),
        );
      });

      test('it should be possible to close the modal clicking on close button', async function (assert) {
        // when
        await click(screen.getByRole('button', { name: 'Fermer' }));

        // then
        assert.ok(
          screen
            .getByText(t('pages.campaign-landing.alert-mobile-experience-modal.title'))
            .closest('.pix-modal__overlay')
            .classList.toString()
            .includes('pix-modal__overlay--hidden'),
        );
      });
    });
  });

  module('on desktop or tablet', function () {
    test('it should not display a modal', async function (assert) {
      // given
      class MediaServiceStub extends Service {
        isMobile = false;
      }
      this.owner.register('service:media', MediaServiceStub);

      //  when
      const screen = await render(hbs`<Campaigns::Presentation::AlertMobileExperienceModal />`);

      // then
      assert.dom(screen.queryByText(t('pages.campaign-landing.alert-mobile-experience-modal.title'))).doesNotExist();
    });
  });
});
