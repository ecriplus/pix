import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import IssueReports from 'pix-admin/components/certifications/certification/informations/issue-reports';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | certifications/issue-reports', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    class AccessControlStub extends Service {
      hasAccessToCertificationActionsScope = true;
    }
    this.owner.register('service:access-control', AccessControlStub);
  });

  module('when there is no issue report', function () {
    test('it should only display a title', async function (assert) {
      // given
      const issueReports = [];

      // when
      const screen = await render(<template><IssueReports @certificationIssueReports={{issueReports}} /></template>);

      // then
      assert.dom(screen.getByText('Signalements')).exists();
      assert.dom(screen.queryByText(/Signalement\(s\)/)).doesNotExist();
    });
  });

  module('when there is at least one impactful certification issue report', function () {
    test('it should display impactful issue reports', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');

      const issueDescription = "C'est impactant";
      const issueReports = [
        store.createRecord('certification-issue-report', { isImpactful: true, description: issueDescription }),
        store.createRecord('certification-issue-report', { isImpactful: true, description: issueDescription }),
        store.createRecord('certification-issue-report', { isImpactful: false, description: 'other' }),
      ];

      // when
      const screen = await render(<template><IssueReports @certificationIssueReports={{issueReports}} /></template>);

      // then
      assert.dom(screen.getByText('2 Signalement(s) impactant(s)')).exists();
      assert.strictEqual(screen.getAllByText(issueDescription, { exact: false }).length, 2);
    });
  });

  module('when there is at least one not impactful certification issue report', function () {
    test('it should display not impactful issue reports', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');

      const issueDescription = "C'est pas impactant";
      const issueReports = [
        store.createRecord('certification-issue-report', { isImpactful: false, description: issueDescription }),
        store.createRecord('certification-issue-report', { isImpactful: false, description: issueDescription }),
        store.createRecord('certification-issue-report', { isImpactful: true, description: 'other' }),
      ];

      // when
      const screen = await render(<template><IssueReports @certificationIssueReports={{issueReports}} /></template>);

      // then
      assert.dom(screen.getByText('2 Signalement(s) non impactant(s)')).exists();
      assert.strictEqual(screen.getAllByText(issueDescription, { exact: false }).length, 2);
    });
  });
});
