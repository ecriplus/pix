import { render, within } from '@1024pix/ember-testing-library';
import dayjs from 'dayjs';
import History from 'pix-admin/components/complementary-certifications/item/target-profile/history';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../../../helpers/setup-intl-rendering';

module('Integration | Component | complementary-certifications/item/target-profile/history', function (hooks) {
  setupIntlRenderingTest(hooks);

  test("it should display history for complementary certification's target profiles", async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const complementaryCertification = store.createRecord('complementary-certification', {
      targetProfilesHistory: [
        { id: 1023, name: 'Target Cascade', attachedAt: dayjs('2023-10-10T10:50:00Z'), detachedAt: null },
        {
          id: 1025,
          name: 'Target Volcan',
          attachedAt: dayjs('2019-10-08T10:50:00Z'),
          detachedAt: dayjs('2020-10-08T10:50:00Z'),
        },
      ],
    });

    // when
    const screen = await render(
      <template><History @targetProfilesHistory={{complementaryCertification.targetProfilesHistory}} /></template>,
    );

    // then
    const table = screen.getByRole('table', {
      name: t('components.complementary-certifications.target-profiles.history-list.caption'),
    });
    assert.dom(within(table).getByRole('columnheader', { name: 'Nom du profil cible' })).exists();
    assert.dom(within(table).getByRole('columnheader', { name: 'Date de rattachement' })).exists();
    assert.dom(within(table).getByRole('columnheader', { name: 'Date de détachement' })).exists();
    assert.dom(within(table).getByRole('row', { name: 'Target Cascade 10/10/2023 -' })).exists();
    assert.dom(within(table).getByRole('row', { name: 'Target Volcan 08/10/2019 08/10/2020' })).exists();
    assert.dom(within(table).getByRole('link', { name: 'Target Cascade' })).exists();
    assert.dom(within(table).getByRole('link', { name: 'Target Volcan' })).exists();
  });
});
