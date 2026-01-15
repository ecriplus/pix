import { render } from '@1024pix/ember-testing-library';
import List from 'pix-admin/components/sessions/certifications/list';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Component | certifications/list', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;

  hooks.beforeEach(async function () {
    store = this.owner.lookup('service:store');
  });

  test('should display number of certification issue reports with required action', async function (assert) {
    // given
    const currentUser = this.owner.lookup('service:currentUser');
    currentUser.adminMember = { isSuperAdmin: true };

    const juryCertificationSummaries = [
      store.createRecord('jury-certification-summary', {
        id: '1',
        numberOfCertificationIssueReportsWithRequiredAction: 2,
      }),
    ];

    const pagination = {};

    // when
    await render(
      <template>
        <List @juryCertificationSummaries={{juryCertificationSummaries}} @pagination={{pagination}} />
      </template>,
    );

    const numberOfCertificationIssueReportsWithRequiredAction =
      this.element.querySelector('tbody > tr td:nth-child(5)');
    assert.dom(numberOfCertificationIssueReportsWithRequiredAction).hasText('2');
  });

  test('should display the complementary certification', async function (assert) {
    // given
    const currentUser = this.owner.lookup('service:currentUser');
    currentUser.adminMember = { isSuperAdmin: true };

    const juryCertificationSummaries = [
      store.createRecord('jury-certification-summary', {
        certificationObtained: 'Pix+ Droit',
      }),
    ];
    const pagination = {};

    // when
    const screen = await render(
      <template>
        <List @juryCertificationSummaries={{juryCertificationSummaries}} @pagination={{pagination}} />
      </template>,
    );

    // then
    assert.dom(screen.getByText('Pix+ Droit', { exact: false })).exists();
  });

  module('when user has a SuperAdmin, Certif or Support role', function () {
    test('it displays certification IDs as clickable links', async function (assert) {
      // given
      const currentUser = this.owner.lookup('service:currentUser');
      currentUser.adminMember = { isSuperAdmin: true };

      const juryCertificationSummaries = [
        store.createRecord('jury-certification-summary', {
          id: '1234',
        }),
      ];
      const pagination = {};

      // when
      const screen = await render(
        <template>
          <List @juryCertificationSummaries={{juryCertificationSummaries}} @pagination={{pagination}} />
        </template>,
      );

      // then
      assert.dom(screen.getByRole('link', { name: '1234' })).exists();
    });
  });

  module('when user has a metier role', function () {
    test('it displays certification IDs as plain text', async function (assert) {
      // given
      const currentUser = this.owner.lookup('service:currentUser');
      currentUser.adminMember = { isMetier: true };

      const juryCertificationSummaries = [
        store.createRecord('jury-certification-summary', {
          id: '1234',
        }),
      ];
      const pagination = {};

      // when
      const screen = await render(
        <template>
          <List @juryCertificationSummaries={{juryCertificationSummaries}} @pagination={{pagination}} />
        </template>,
      );

      // then
      assert.dom(screen.getByText('1234')).exists();
      assert.dom(screen.queryByRole('link', { name: '1234' })).doesNotExist();
    });
  });
});
