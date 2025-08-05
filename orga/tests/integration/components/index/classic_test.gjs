import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import IndexClassic from 'pix-orga/components/index/classic';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Index::Classic', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display welcome message', async function (assert) {
    class CurrentUserStub extends Service {
      prescriber = {
        firstName: 'Jean',
      };
    }
    this.owner.register('service:current-user', CurrentUserStub);
    const screen = await render(<template><IndexClassic /></template>);

    // then
    assert.ok(screen.getByRole('heading', { name: t('pages.index.welcome-title', { name: 'Jean' }) }));
    assert.ok(screen.getByText(t('pages.index.classic.description')));
    assert.ok(screen.getByRole('heading', { name: t('pages.index.classic.organization-information.title') }));
  });

  test('should display organization information', async function (assert) {
    class CurrentUserStub extends Service {
      prescriber = {
        firstName: 'Jean',
      };

      organization = {
        name: 'Ma super organization',
      };
    }
    this.owner.register('service:current-user', CurrentUserStub);
    const screen = await render(<template><IndexClassic /></template>);

    // then
    assert.ok(screen.getByRole('heading', { name: t('pages.index.classic.organization-information.title') }));
    assert.ok(screen.getByText(t('pages.index.classic.organization-information.label')));
    assert.ok(screen.getByText('Ma super organization'));
  });
});
