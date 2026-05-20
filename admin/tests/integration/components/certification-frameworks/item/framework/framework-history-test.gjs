import { render } from '@1024pix/ember-testing-library';
import { click } from '@ember/test-helpers';
import FrameworkHistory from 'pix-admin/components/certification-frameworks/item/framework/framework-history';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest, { t } from '../../../../../helpers/setup-intl-rendering';

module('Integration | Component | Complementary certifications/Item/Framework | Framework history', function (hooks) {
  setupIntlRenderingTest(hooks);

  let intl;

  let store;

  let pixToast;

  hooks.beforeEach(function () {
    intl = this.owner.lookup('service:intl');
    store = this.owner.lookup('service:store');
    pixToast = this.owner.lookup('service:pix-toast');
  });

  test('it should display the framework history', async function (assert) {
    // given
    const frameworkHistory = [
      {
        id: 456,
        startDate: new Date('2023-10-10'),
        expirationDate: null,
        assessmentDuration: 90,
        maximumAssessmentLength: 32,
        status: 'ACTIVE',
      },
      {
        id: 123,
        startDate: new Date('2020-01-01'),
        expirationDate: new Date('2021-06-15'),
        assessmentDuration: 105,
        maximumAssessmentLength: 32,
        status: 'ARCHIVED',
      },
    ];

    // when
    const screen = await render(<template><FrameworkHistory @history={{frameworkHistory}} /></template>);

    // then
    assert
      .dom(
        screen.getByRole('table', {
          name: t('components.complementary-certifications.item.framework.history.table.caption'),
        }),
      )
      .exists();

    assert.strictEqual(screen.getAllByRole('row').length, frameworkHistory.length + 1);

    assert.dom(screen.getByRole('cell', { name: `${frameworkHistory[0].id}` })).exists();
    assert.dom(screen.getByRole('cell', { name: intl.formatDate(frameworkHistory[0].startDate) })).exists();
    assert
      .dom(screen.getByText(t('components.complementary-certifications.item.framework.history.statuses.ACTIVE')))
      .hasClass('pix-tag--success');

    assert.dom(screen.getByRole('cell', { name: `${frameworkHistory[1].id}` })).exists();
    assert.dom(screen.getByRole('cell', { name: intl.formatDate(frameworkHistory[1].startDate) })).exists();
    assert
      .dom(screen.getByText(t('components.complementary-certifications.item.framework.history.statuses.ARCHIVED')))
      .hasClass('pix-tag--secondary');
  });

  test('it opens the detail modal when clicking the view button', async function (assert) {
    // given
    const frameworkHistory = [
      {
        id: 456,
        startDate: new Date('2023-10-10'),
        expirationDate: null,
        assessmentDuration: 90,
        maximumAssessmentLength: 32,
        status: 'ACTIVE',
      },
    ];

    const certificationVersion = store.createRecord('certification-version', {
      id: '456',
      startDate: new Date('2023-10-10'),
      assessmentDuration: 90,
      areas: [],
    });
    sinon.stub(store, 'findRecord').resolves(certificationVersion);

    // when
    const screen = await render(<template><FrameworkHistory @history={{frameworkHistory}} @scope="CORE" /></template>);

    await click(
      screen.getByRole('button', {
        name: t('components.complementary-certifications.item.framework.history.table.actions.view'),
      }),
    );

    // then
    sinon.assert.calledOnceWithExactly(store.findRecord, 'certification-version', 456);
    assert.dom(screen.getByRole('dialog')).exists();
  });

  test('it leaves detail modal opened after saving comments successfully', async function (assert) {
    // given
    const frameworkHistory = [
      {
        id: 456,
        startDate: new Date('2023-10-10'),
        expirationDate: null,
        assessmentDuration: 90,
        maximumAssessmentLength: 32,
        status: 'ACTIVE',
      },
    ];

    const certificationVersion = store.createRecord('certification-version', {
      id: '456',
      startDate: new Date('2023-10-10'),
      assessmentDuration: 90,
      minimumAnswersRequiredForValidation: 20,
      maximumAssessmentLength: 32,
      comments: '',
      areas: [],
    });
    sinon.stub(certificationVersion, 'save').resolves();
    sinon.stub(store, 'findRecord').resolves(certificationVersion);
    sinon.stub(pixToast, 'sendSuccessNotification');

    const screen = await render(<template><FrameworkHistory @history={{frameworkHistory}} @scope="CORE" /></template>);

    await click(
      screen.getByRole('button', {
        name: t('components.complementary-certifications.item.framework.history.table.actions.view'),
      }),
    );
    assert.dom(screen.getByRole('dialog')).exists();

    // when
    await click(screen.getByRole('button', { name: t('common.actions.save') }));

    // then
    assert.dom(screen.queryByRole('dialog')).exists();
  });
});
