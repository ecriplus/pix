import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { click } from '@ember/test-helpers';
import { t } from 'ember-intl/test-support';
import Attestations, {
  PARENTHOOD_ATTESTATION_KEY,
  SIXTH_GRADE_ATTESTATION_KEY,
} from 'pix-orga/components/attestations';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | Attestations', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(function () {
    class CurrentUserStub extends Service {
      prescriber = { availableAttestations: [SIXTH_GRADE_ATTESTATION_KEY] };
    }

    this.owner.register('service:current-user', CurrentUserStub);
  });

  module('when organization has divisions, SIXTH_GRADE attestation and another attestation', function () {
    test('it displays both way to download attestations', async function (assert) {
      // given
      const noop = sinon.stub();
      const currentUser = this.owner.lookup('service:current-user');
      currentUser.prescriber.availableAttestations = [SIXTH_GRADE_ATTESTATION_KEY, PARENTHOOD_ATTESTATION_KEY];
      const divisions = [];

      // when
      const screen = await render(
        <template><Attestations @divisions={{divisions}} @onSubmit={{noop}} @onFilter={{noop}} /></template>,
      );

      // then
      assert.ok(screen.getByText(t('pages.attestations.basic-description')));
    });
  });

  module('when organization has divisions and SIXTH_GRADE attestation', function () {
    test('it should display all specifics information for divisions', async function (assert) {
      // given
      const noop = sinon.stub();
      const onSubmit = sinon.stub();
      const divisions = [];

      // when
      const screen = await render(
        <template><Attestations @divisions={{divisions}} @onSubmit={{onSubmit}} @onFilter={{noop}} /></template>,
      );

      // then
      assert.ok(screen.getByRole('heading', { name: t('pages.attestations.title') }));
      assert.ok(screen.getByRole('textbox', { name: t('pages.attestations.select-divisions-label') }));
      assert.ok(screen.getByPlaceholderText(t('common.filters.placeholder')));
      assert.ok(screen.getByRole('button', { name: t('pages.attestations.download-attestations-button') }));
    });

    test('download button is disabled if there is no selected divisions', async function (assert) {
      // given
      const noop = sinon.stub();
      const divisions = [];

      // when
      const screen = await render(
        <template><Attestations @divisions={{divisions}} @onSubmit={{noop}} @onFilter={{noop}} /></template>,
      );

      // then
      const downloadButton = await screen.getByRole('button', {
        name: t('pages.attestations.download-attestations-button'),
      });
      assert.dom(downloadButton).hasAttribute('aria-disabled');
    });

    test('it should call onSubmit action with selected divisions', async function (assert) {
      // given
      const noop = sinon.stub();
      const onSubmit = sinon.stub();

      const divisions = [{ label: 'division1', value: 'division1' }];

      // when
      const screen = await render(
        <template><Attestations @divisions={{divisions}} @onSubmit={{onSubmit}} @onFilter={{noop}} /></template>,
      );

      const multiSelect = await screen.getByRole('textbox', { name: t('pages.attestations.select-divisions-label') });
      await click(multiSelect);

      const firstDivisionOption = await screen.findByRole('checkbox', { name: 'division1' });
      await click(firstDivisionOption);

      const downloadButton = await screen.getByRole('button', {
        name: t('pages.attestations.download-attestations-button'),
      });

      await click(downloadButton);

      // then
      sinon.assert.calledWithExactly(onSubmit, SIXTH_GRADE_ATTESTATION_KEY, ['division1']);
      assert.ok(true);
    });
  });

  module('when organization does not have divisions and SIXTH_GRADE attestation', function () {
    test('it should display all basics information', async function (assert) {
      // given
      const noop = sinon.stub();
      const divisions = undefined;

      // when
      const screen = await render(
        <template><Attestations @divisions={{divisions}} @onSubmit={{noop}} @onFilter={{noop}} /></template>,
      );
      // then
      assert.notOk(screen.queryByRole('textbox', { name: t('pages.attestations.select-label') }));
      assert.ok(screen.getByRole('heading', { name: t('pages.attestations.title') }));
      assert.ok(screen.getByText(t('pages.attestations.basic-description')));
      assert.ok(screen.getByRole('button', { name: t('pages.attestations.download-attestations-button') }));
    });

    test('it should call onSubmit action with empty divisions', async function (assert) {
      // given
      const noop = sinon.stub();
      const onSubmit = sinon.stub();

      const divisions = undefined;

      // when
      const screen = await render(
        <template><Attestations @divisions={{divisions}} @onSubmit={{onSubmit}} @onFilter={{noop}} /></template>,
      );

      const downloadButton = await screen.getByRole('button', {
        name: t('pages.attestations.download-attestations-button'),
      });

      const select = await screen.getByLabelText(t('pages.attestations.select-label'));
      await click(select);

      const firstOption = await screen.findByRole('option', {
        name: t('pages.attestations.' + SIXTH_GRADE_ATTESTATION_KEY),
      });
      await click(firstOption);

      await click(downloadButton);

      // then
      sinon.assert.calledWithExactly(onSubmit, SIXTH_GRADE_ATTESTATION_KEY, []);
      assert.ok(true);
    });
  });
});
