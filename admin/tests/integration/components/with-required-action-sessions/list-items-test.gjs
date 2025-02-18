import { render, within } from '@1024pix/ember-testing-library';
import ListItems from 'pix-admin/components/with-required-action-sessions/list-items';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../helpers/setup-intl-rendering';

module('Integration | Component | with-required-action-sessions | list-items', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display to be published sessions list', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const firstSession = store.createRecord('with-required-action-session', {
      id: '1',
      certificationCenterName: 'Centre SCO des Anne-Étoiles',
      sessionDate: '2021-01-01',
      sessionTime: '17:00:00',
      assignedCertificationOfficerName: 'Officer1',
      version: 2,
    });
    const sessions = [firstSession];

    // when
    const screen = await render(<template><ListItems @withRequiredActionSessions={{sessions}} /></template>);

    // then
    const table = screen.getByRole('table', { name: t('pages.sessions.table.required-actions.caption') });
    assert
      .dom(within(table).getByRole('columnheader', { name: t('pages.sessions.table.required-actions.headers.id') }))
      .exists();
    assert
      .dom(
        within(table).getByRole('columnheader', {
          name: t('pages.sessions.table.required-actions.headers.certification-name'),
        }),
      )
      .exists();
    assert
      .dom(
        within(table).getByRole('columnheader', {
          name: t('pages.sessions.table.required-actions.headers.session-date'),
        }),
      )
      .exists();
    assert
      .dom(
        within(table).getByRole('columnheader', {
          name: t('pages.sessions.table.required-actions.headers.finalization-date'),
        }),
      )
      .exists();
    assert
      .dom(
        within(table).getByRole('columnheader', {
          name: t('pages.sessions.table.required-actions.headers.assigned-officer-name'),
        }),
      )
      .exists();
  });

  module('when there is no session to display', function () {
    test('it should display an empty result message', async function (assert) {
      // given
      const sessions = [];

      // when
      const screen = await render(<template><ListItems @withRequiredActionSessions={{sessions}} /></template>);

      // then
      assert.dom(screen.getByText(t('common.tables.empty-result'))).exists();
    });
  });
});
