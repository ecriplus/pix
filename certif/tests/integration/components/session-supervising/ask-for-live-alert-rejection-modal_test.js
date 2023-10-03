import { module, test } from 'qunit';
import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';
import { hbs } from 'ember-cli-htmlbars';
import sinon from 'sinon';
import { render as renderScreen } from '@1024pix/ember-testing-library';

module('Integration | Component | ask-for-live-alert-rejection-modal', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it shows candidate details with action buttons', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const candidate = store.createRecord('certification-candidate', {
      firstName: 'Jean-Paul',
      lastName: 'Candidat',
      liveAlertStatus: 'ongoing',
    });

    this.set('isModalDisplayed', sinon.stub());
    this.set('closeModal', sinon.stub());
    this.set('candidateFullName', `${candidate.firstName} ${candidate.lastName}`);
    this.set('rejectLiveAlert', sinon.stub());

    // when
    const screen = await renderScreen(hbs`
        <SessionSupervising::AskForLiveAlertRejectionModal
          @showModal={{this.isModalDisplayed}}
          @closeConfirmationModal={{this.closeModal}}
          @title={{this.candidateFullName}}
          @rejectLiveAlert={{this.rejectLiveAlert}}
        />
      `);

    // then
    assert.dom(screen.getByText('Jean-Paul Candidat')).exists();
    assert.dom(screen.getByRole('button', { name: 'Refuser le signalement' })).exists();
  });
});