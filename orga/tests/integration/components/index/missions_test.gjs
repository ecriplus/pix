import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import IndexMissions from 'pix-orga/components/index/missions';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Index::Missions', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('should display welcome message', async function (assert) {
    class CurrentUserStub extends Service {
      prescriber = {
        firstName: 'Jean',
      };
    }
    this.owner.register('service:current-user', CurrentUserStub);
    const screen = await render(<template><IndexMissions /></template>);

    // then
    assert.ok(screen.getByRole('heading', { name: t('pages.index.welcome-title', { name: 'Jean' }) }));
    assert.ok(screen.getByText(t('pages.index.missions.description')));
    assert.ok(screen.getByRole('heading', { name: t('pages.index.missions.organization-information.title') }));
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
    const screen = await render(<template><IndexMissions /></template>);

    // then
    assert.ok(screen.getByRole('heading', { name: t('pages.index.missions.organization-information.title') }));
    assert.ok(screen.getByText(t('pages.index.missions.organization-information.label')));
    assert.ok(screen.getByText('Ma super organization'));
  });
});
