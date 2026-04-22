import { setupTest } from 'ember-qunit';
import { certificationStatuses } from 'pix-admin/models/certification';
import setupIntl from 'pix-admin/tests/helpers/setup-intl';
import { module, test } from 'qunit';

module('Unit | Model | jury-certification-summary', function (hooks) {
  setupTest(hooks);
  setupIntl(hooks);

  let store;
  let intl;

  hooks.beforeEach(async function () {
    store = this.owner.lookup('service:store');
    intl = this.owner.lookup('service:intl');
  });

  module('#statusLabel', function () {
    certificationStatuses.forEach(function ({ value, label }) {
      module(`when the status is ${value}`, function () {
        test(`statusLabel should return ${label}`, function (assert) {
          // given
          const juryCertificationSummaryProcessed = store.createRecord('jury-certification-summary', { status: value });

          // when
          const statusLabel = juryCertificationSummaryProcessed.get('statusLabel');

          // then
          assert.strictEqual(statusLabel, label);
        });
      });
    });
  });

  module('#numberOfCertificationIssueReportsWithRequiredActionLabel', function () {
    test('it returns an empty string when there are no issue reports', function (assert) {
      // given
      const juryCertificationSummaryProcessed = store.createRecord('jury-certification-summary', {
        numberOfCertificationIssueReportsWithRequiredAction: 0,
      });

      // when
      const numberOfCertificationIssueReportsWithRequiredActionLabel =
        juryCertificationSummaryProcessed.numberOfCertificationIssueReportsWithRequiredActionLabel;

      // then
      assert.strictEqual(numberOfCertificationIssueReportsWithRequiredActionLabel, '');
    });

    test('it returns the count of issue reports when there are some', function (assert) {
      // given
      const juryCertificationSummaryProcessed = store.createRecord('jury-certification-summary', {
        numberOfCertificationIssueReportsWithRequiredAction: 4,
      });

      // when
      const numberOfCertificationIssueReportsWithRequiredActionLabel =
        juryCertificationSummaryProcessed.numberOfCertificationIssueReportsWithRequiredActionLabel;

      // then
      assert.strictEqual(numberOfCertificationIssueReportsWithRequiredActionLabel, 4);
    });
  });

  module('#get isCertificationStarted', function () {
    test('it should return true when the status is "started"', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'started' });

      // when
      const isCertificationStarted = juryCertificationSummary.isCertificationStarted;

      // then
      assert.true(isCertificationStarted);
    });

    test('it should return false when the status is "validated" (not started)', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'validated' });

      // when
      const isCertificationStarted = juryCertificationSummary.isCertificationStarted;

      // then
      assert.false(isCertificationStarted);
    });

    test('it should return false when the status is "rejected" (not started)', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'rejected' });

      // when
      const isCertificationStarted = juryCertificationSummary.isCertificationStarted;

      // then
      assert.false(isCertificationStarted);
    });

    test('it should return false when the status is "error" (not started)', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'error' });

      // when
      const isCertificationStarted = juryCertificationSummary.isCertificationStarted;

      // then
      assert.false(isCertificationStarted);
    });

    test('it should return false when the status is "cancelled" (not started)', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'cancelled' });

      // when
      const isCertificationStarted = juryCertificationSummary.isCertificationStarted;

      // then
      assert.false(isCertificationStarted);
    });
  });

  module('#isCertificationInError', function () {
    test('it should return true when the status is "error"', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'error' });

      // when
      const isCertificationInError = juryCertificationSummary.isCertificationInError;

      // then
      assert.true(isCertificationInError);
    });

    test('it should return false when the status is "started" (not in error)', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'started' });

      // when
      const isCertificationInError = juryCertificationSummary.isCertificationInError;

      // then
      assert.false(isCertificationInError);
    });

    test('it should return false when the status is "validated" (not in error)', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'validated' });

      // when
      const isCertificationInError = juryCertificationSummary.isCertificationInError;

      // then
      assert.false(isCertificationInError);
    });

    test('it should return false when the status is "rejected" (not in error)', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'rejected' });

      // when
      const isCertificationInError = juryCertificationSummary.isCertificationInError;

      // then
      assert.false(isCertificationInError);
    });

    test('it should return false when the status is "cancelled" (not in error)', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'cancelled' });

      // when
      const isCertificationInError = juryCertificationSummary.isCertificationInError;

      // then
      assert.false(isCertificationInError);
    });
  });

  module('#canPublish', function () {
    test('it should return false when the status is "error"', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { status: 'error' });

      // when
      const canPublish = juryCertificationSummary.canPublish;

      // then
      assert.false(canPublish);
    });

    test('it should return false when certificationFramework is "PRO_SANTE"', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', {
        status: 'validated',
        certificationFramework: 'PRO_SANTE',
      });

      // when
      const canPublish = juryCertificationSummary.canPublish;

      // then
      assert.false(canPublish);
    });

    test('it should return false when certificationFramework is "DROIT"', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', {
        status: 'validated',
        certificationFramework: 'DROIT',
      });

      // when
      const canPublish = juryCertificationSummary.canPublish;

      // then
      assert.false(canPublish);
    });

    test('it should return true when the status is validated and certificationFramework is CORE', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', {
        status: 'validated',
        certificationFramework: 'CORE',
      });

      // when
      const canPublish = juryCertificationSummary.canPublish;

      // then
      assert.true(canPublish);
    });

    test('it should return true when the status is rejected and certificationFramework is CORE', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', {
        status: 'rejected',
        certificationFramework: 'CORE',
      });

      // when
      const canPublish = juryCertificationSummary.canPublish;

      // then
      assert.true(canPublish);
    });
  });

  module('#get lastAnswerDate', function () {
    test('it should return null if lastAnswerAt is null', function (assert) {
      // given
      const juryCertificationSummary = store.createRecord('jury-certification-summary', {
        lastAnswerAt: null,
      });

      // then
      assert.notOk(juryCertificationSummary.lastAnswerDate, null);
    });

    test('it should a formatted date when lastAnswerAt is defined', function (assert) {
      // given
      const lastAnswerAt = '2021-06-30 15:10:45';
      const juryCertificationSummary = store.createRecord('jury-certification-summary', { lastAnswerAt });

      // then
      const expectedFormat = intl.formatDate(new Date(lastAnswerAt), { format: 'long' });
      assert.strictEqual(juryCertificationSummary.lastAnswerDate, expectedFormat);
    });
  });
});
