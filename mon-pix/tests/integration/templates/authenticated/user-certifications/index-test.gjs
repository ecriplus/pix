import { render } from '@1024pix/ember-testing-library';
import { t } from 'ember-intl/test-support';
import UserCertificationsIndex from 'mon-pix/templates/authenticated/user-certifications/index';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Template | Authenticated | User certifications | Index', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('displays page title and subtitle', async function (assert) {
    // given
    const model = [];

    // when
    const screen = await render(<template><UserCertificationsIndex @model={{model}} /></template>);

    // then
    assert.ok(screen.getByText(t('pages.certifications-list.title')));
    assert.ok(screen.getByText(t('pages.certifications-list.description')));
  });

  module('when there are no certifications', function () {
    test('displays empty state message ', async function (assert) {
      // given
      const model = [];

      // when
      const screen = await render(<template><UserCertificationsIndex @model={{model}} /></template>);

      // then
      assert.ok(screen.getByText(t('pages.certifications-list.no-certification.text')));
    });
  });

  module('when there are some certifications', function () {
    test('displays certifications sorted by date descending', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const olderCertification = store.createRecord('certificate-summary', {
        certificationStartedAt: new Date('2023-06-01T10:00:00Z'),
        certificationCenterName: 'Centre Ancien',
        certificationFramework: 'CORE',
        pixScore: 400,
        status: 'WAITING_FOR_RESULTS',
      });
      const newerCertification = store.createRecord('certificate-summary', {
        certificationStartedAt: new Date('2024-12-01T10:00:00Z'),
        certificationCenterName: 'Centre Récent',
        certificationFramework: 'CORE',
        pixScore: 600,
        status: 'WAITING_FOR_RESULTS',
      });
      const model = [olderCertification, newerCertification];

      // when
      const screen = await render(<template><UserCertificationsIndex @model={{model}} /></template>);

      // then
      const listItems = screen.getAllByRole('listitem');
      assert.strictEqual(listItems.length, 2);
      assert.dom(listItems[0]).hasText(/Centre Récent/);
      assert.dom(listItems[1]).hasText(/Centre Ancien/);

      assert.dom(screen.queryByText(t('pages.certifications-list.no-certification.text'))).doesNotExist();
    });
  });
});
