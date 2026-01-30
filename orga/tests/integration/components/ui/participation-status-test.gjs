import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import ParticipationStatus from 'pix-orga/components/ui/participation-status';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Ui | ParticipationStatus', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('label', function () {
    test('it should display formatted label', async function (assert) {
      // given
      const status = 'SHARED';

      // when
      const screen = await render(<template><ParticipationStatus @status={{status}} /></template>);

      // then
      assert.ok(screen.getByText(t('components.participation-status.SHARED')));
    });
    test('it should display not started label if status is null', async function (assert) {
      // given
      const status = null;

      // when
      const screen = await render(<template><ParticipationStatus @status={{status}} /></template>);

      // then
      assert.ok(screen.getByText(t('components.participation-status.NOT_STARTED')));
    });
  });
});
