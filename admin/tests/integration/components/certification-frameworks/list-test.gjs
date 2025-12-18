import { render, within } from '@1024pix/ember-testing-library';
import List from 'pix-admin/components/certification-frameworks/list';
import { module, test } from 'qunit';

import setupIntlRenderingTest, { t } from '../../../helpers/setup-intl-rendering';

module('Integration | Component | certification-frameworks/list', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display certification frameworks list', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const certificationFrameworks = [
      store.createRecord('certification-framework', {
        id: 'CORE',
        name: 'Pix',
        activeVersionStartDate: new Date('2024-01-01'),
      }),
      store.createRecord('certification-framework', {
        id: 'DROIT',
        name: 'Pix+Droit',
        activeVersionStartDate: null,
      }),
    ];
    const complementaryCertifications = [];

    // when
    const screen = await render(
      <template>
        <List
          @certificationFrameworks={{certificationFrameworks}}
          @complementaryCertifications={{complementaryCertifications}}
        />
      </template>,
    );

    // then
    const table = screen.getByRole('table', { name: t('components.certification-frameworks.list.caption') });
    assert
      .dom(within(table).getByRole('columnheader', { name: t('components.certification-frameworks.list.name') }))
      .exists();
    assert
      .dom(
        within(table).getByRole('columnheader', {
          name: t('components.certification-frameworks.list.active-version-start-date'),
        }),
      )
      .exists();

    const rows = within(table).getAllByRole('row');
    assert.strictEqual(rows.length, 3);
  });

  test('it should display "-" when activeVersionStartDate is null', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const certificationFrameworks = [
      store.createRecord('certification-framework', {
        id: 'DROIT',
        name: 'Pix+Droit',
        activeVersionStartDate: null,
      }),
    ];
    const complementaryCertifications = [];

    // when
    const screen = await render(
      <template>
        <List
          @certificationFrameworks={{certificationFrameworks}}
          @complementaryCertifications={{complementaryCertifications}}
        />
      </template>,
    );

    // then
    assert.dom(screen.getByText('-')).exists();
  });

  test('it should display a link to item route when complementary certification exists', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const certificationFrameworks = [
      store.createRecord('certification-framework', {
        id: 'DROIT',
        name: 'Pix+Droit',
      }),
    ];
    const complementaryCertifications = [
      store.createRecord('complementary-certification', {
        id: '123',
        key: 'DROIT',
      }),
    ];

    // when
    const screen = await render(
      <template>
        <List
          @certificationFrameworks={{certificationFrameworks}}
          @complementaryCertifications={{complementaryCertifications}}
        />
      </template>,
    );

    // then
    const link = screen.getByRole('link', { name: t('components.certification-frameworks.labels.DROIT') });
    assert.dom(link).exists();
    assert.dom(link).hasAttribute('href', '/complementary-certifications/123');
  });

  test('it should display plain text when complementary certification does not exist', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const certificationFrameworks = [
      store.createRecord('certification-framework', {
        id: 'CORE',
        name: 'Pix',
      }),
    ];
    const complementaryCertifications = [];

    // when
    const screen = await render(
      <template>
        <List
          @certificationFrameworks={{certificationFrameworks}}
          @complementaryCertifications={{complementaryCertifications}}
        />
      </template>,
    );

    // then
    assert
      .dom(screen.queryByRole('link', { name: t('components.certification-frameworks.labels.CORE') }))
      .doesNotExist();
    assert.dom(screen.getByText(t('components.certification-frameworks.labels.CORE'))).exists();
  });
});
