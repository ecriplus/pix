import { render as renderScreen } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { click } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../helpers/setup-intl-rendering';

module('Integration | Component | new-certification-candidate-modal', function (hooks) {
  setupIntlRenderingTest(hooks);

  hooks.beforeEach(async function () {
    const store = this.owner.lookup('service:store');

    class CurrentUserStub extends Service {
      currentAllowedCertificationCenterAccess = store.createRecord('allowed-certification-center-access', {
        habilitations: [
          { id: 0, label: 'Certif complémentaire 1', key: 'COMP_1' },
          { id: 1, label: 'Certif complémentaire 2', key: 'COMP_2' },
        ],
      });
    }

    this.owner.register('service:current-user', CurrentUserStub);
  });

  test('it shows candidate form', async function (assert) {
    // given
    const closeModalStub = sinon.stub();
    const updateCandidateStub = sinon.stub();
    const updateCandidateWithEventStub = sinon.stub();
    this.set('closeModal', closeModalStub);
    this.set('updateCandidateStub', updateCandidateStub);
    this.set('updateCandidateWithEventStub', updateCandidateWithEventStub);
    this.set('countries', []);
    this.set('candidateData', {
      firstName: '',
      lastName: '',
      birthdate: '',
      birthCity: '',
      birthCountry: '',
      email: '',
      externalId: '',
      resultRecipientEmail: '',
      birthPostalCode: '',
      birthInseeCode: '',
      sex: '',
      extraTimePercentage: '',
    });

    // when
    const screen = await renderScreen(hbs`
      <NewCertificationCandidateModal
        @showModal={{true}}
        @closeModal={{this.closeModal}}
        @countries={{this.countries}}
        @updateCandidateData={{this.updateCandidateStub}}
        @updateCandidateDataWithEvent={{this.updateCandidateStub}}
        @candidateData={{this.candidateData}}
      />
    `);

    // then
    assert.dom(screen.getByRole('textbox', { name: 'Obligatoire Nom de naissance' })).exists();
    assert.dom(screen.getByRole('textbox', { name: 'Obligatoire Prénom' })).exists();
    assert.dom(screen.getByRole('radio', { name: 'Homme' })).exists();
    assert.dom(screen.getByRole('radio', { name: 'Femme' })).exists();
    assert.dom(screen.getByRole('textbox', { name: 'Obligatoire Date de naissance' })).exists();
    assert.dom(screen.getByRole('button', { name: 'Obligatoire Pays de naissance' })).exists();
    assert.dom(screen.getByRole('radio', { name: 'Code INSEE' })).exists();
    assert.dom(screen.getByRole('radio', { name: 'Code postal' })).exists();
    assert.dom(screen.getByRole('textbox', { name: 'Obligatoire Code INSEE de naissance' })).exists();
    assert.dom(screen.getByRole('textbox', { name: 'Identifiant externe' })).exists();
    assert.dom(screen.getByRole('textbox', { name: 'Temps majoré (%)' })).exists();
    assert
      .dom(screen.getByRole('textbox', { name: 'E-mail du destinataire des résultats (formateur, enseignant...)' }))
      .exists();
    assert
      .dom(
        screen.getByText(
          'Si le champ n’est pas renseigné, les résultats ne seront pas transmis par mail pour le/les candidats concernés.Le candidat verra ses résultats affichés directement sur son compte Pix.',
        ),
      )
      .exists();
    assert.dom(screen.getByRole('textbox', { name: 'E-mail de convocation' })).exists();
    assert.dom(screen.getByRole('radio', { name: 'Certif complémentaire 1' })).exists();
    assert.dom(screen.getByRole('radio', { name: 'Certif complémentaire 2' })).exists();
  });

  test('it should have some inputs required', async function (assert) {
    // given
    const closeModalStub = sinon.stub();
    const updateCandidateStub = sinon.stub();
    const updateCandidateWithEventStub = sinon.stub();
    this.set('closeModal', closeModalStub);
    this.set('updateCandidateStub', updateCandidateStub);
    this.set('updateCandidateWithEventStub', updateCandidateWithEventStub);
    this.set('countries', []);

    // when
    const screen = await renderScreen(hbs`
      <NewCertificationCandidateModal
        @showModal={{true}}
        @closeModal={{this.closeModal}}
        @countries={{this.countries}}
        @updateCandidateData={{this.updateCandidateStub}}
        @updateCandidateDataWithEvent={{this.updateCandidateStub}}
      />
    `);

    // then
    assert.dom(screen.getByRole('textbox', { name: 'Obligatoire Nom de naissance' })).hasAttribute('required');
    assert.dom(screen.getByRole('textbox', { name: 'Obligatoire Prénom' })).hasAttribute('required');
    assert.dom(screen.getByRole('textbox', { name: 'Obligatoire Date de naissance' })).hasAttribute('required');
    assert.dom(screen.getByRole('radio', { name: 'Femme' })).hasAttribute('required');
    assert.dom(screen.getByRole('textbox', { name: 'Obligatoire Code INSEE de naissance' })).hasAttribute('required');
  });

  module('when shouldDisplayPaymentOptions is true', function () {
    test('it shows candidate form with billing information', async function (assert) {
      // given
      const shouldDisplayPaymentOptions = true;
      const closeModalStub = sinon.stub();
      const updateCandidateStub = sinon.stub();
      const updateCandidateWithEventStub = sinon.stub();
      const updateCandidateFromValueStub = sinon.stub();
      this.set('updateCandidateFromValueStub', updateCandidateFromValueStub);
      this.set('shouldDisplayPaymentOptions', shouldDisplayPaymentOptions);
      this.set('closeModal', closeModalStub);
      this.set('updateCandidateStub', updateCandidateStub);
      this.set('updateCandidateWithEventStub', updateCandidateWithEventStub);
      this.set('countries', []);
      this.set('candidateData', {
        firstName: '',
        lastName: '',
        birthdate: '',
        birthCity: '',
        birthCountry: '',
        email: '',
        externalId: '',
        resultRecipientEmail: '',
        birthPostalCode: '',
        birthInseeCode: '',
        sex: '',
        extraTimePercentage: '',
        billingMode: '',
        prepaymentCode: '',
      });

      // when
      const screen = await renderScreen(hbs`
        <NewCertificationCandidateModal
          @showModal={{true}}
          @closeModal={{this.closeModal}}
          @countries={{this.countries}}
          @updateCandidateData={{this.updateCandidateStub}}
          @updateCandidateDataWithEvent={{this.updateCandidateStub}}
          @candidateData={{this.candidateData}}
          @shouldDisplayPaymentOptions={{this.shouldDisplayPaymentOptions}}
          @updateCandidateDataFromValue={{this.updateCandidateFromValueStub}}
        />
      `);

      // then
      assert.dom(screen.getByRole('button', { name: 'Obligatoire Tarification part Pix' })).exists();
      assert.dom(screen.getByRole('textbox', { name: 'Code de prépaiement' })).exists();
      assert.dom(screen.getByLabelText('Information du code de prépaiement')).exists();
    });
  });

  test('it shows a countries list with France selected as default', async function (assert) {
    // given
    const closeModalStub = sinon.stub();
    const updateCandidateStub = sinon.stub();
    const updateCandidateWithEventStub = sinon.stub();
    this.set('closeModal', closeModalStub);
    this.set('updateCandidateStub', updateCandidateStub);
    this.set('updateCandidateWithEventStub', updateCandidateWithEventStub);
    this.set('candidateData', {
      firstName: '',
      lastName: '',
      birthdate: '',
      birthCity: '',
      birthCountry: '',
      email: '',
      externalId: '',
      resultRecipientEmail: '',
      birthPostalCode: '',
      birthInseeCode: '',
      sex: '',
      extraTimePercentage: '',
    });
    this.set('countries', [
      { id: 1, code: '99123', name: 'Syldavie' },
      { id: 2, code: '99100', name: 'France' },
      { id: 3, code: '99345', name: 'Botswana' },
    ]);

    // when
    const screen = await renderScreen(hbs`
      <NewCertificationCandidateModal
        @showModal={{true}}
        @closeModal={{this.closeModal}}
        @countries={{this.countries}}
        @updateCandidateData={{this.updateCandidateStub}}
        @updateCandidateDataWithEvent={{this.updateCandidateStub}}
        @candidateData={{this.candidateData}}
      />
    `);

    // then
    assert.dom(screen.getByRole('button', { name: 'Obligatoire Pays de naissance' })).includesText('France');
  });

  module('when close button cross icon is clicked', () => {
    test('it closes candidate details modal', async function (assert) {
      const closeModalStub = sinon.stub();
      const updateCandidateStub = sinon.stub();
      const updateCandidateWithEventStub = sinon.stub();
      this.set('closeModal', closeModalStub);
      this.set('updateCandidateStub', updateCandidateStub);
      this.set('updateCandidateWithEventStub', updateCandidateWithEventStub);
      this.set('countries', []);
      this.set('candidateData', {
        firstName: '',
        lastName: '',
        birthdate: '',
        birthCity: '',
        birthCountry: '',
        email: '',
        externalId: '',
        resultRecipientEmail: '',
        birthPostalCode: '',
        birthInseeCode: '',
        sex: '',
        extraTimePercentage: '',
      });

      // when
      const screen = await renderScreen(hbs`
        <NewCertificationCandidateModal
          @showModal={{true}}
          @closeModal={{this.closeModal}}
          @countries={{this.countries}}
          @updateCandidateData={{this.updateCandidateStub}}
          @updateCandidateDataWithEvent={{this.updateCandidateStub}}
          @candidateData={{this.candidateData}}
        />
      `);

      await click(screen.getByRole('button', { name: 'Fermer' }));

      // then
      sinon.assert.calledOnce(closeModalStub);
      assert.ok(true);
    });
  });

  module('when close bottom button is clicked', () => {
    test('it closes candidate details modal ', async function (assert) {
      const closeModalStub = sinon.stub();
      const updateCandidateStub = sinon.stub();
      const updateCandidateWithEventStub = sinon.stub();
      this.set('closeModal', closeModalStub);
      this.set('updateCandidateStub', updateCandidateStub);
      this.set('updateCandidateWithEventStub', updateCandidateWithEventStub);
      this.set('countries', []);
      this.set('candidateData', {
        firstName: '',
        lastName: '',
        birthdate: '',
        birthCity: '',
        birthCountry: '',
        email: '',
        externalId: '',
        resultRecipientEmail: '',
        birthPostalCode: '',
        birthInseeCode: '',
        sex: '',
        extraTimePercentage: '',
      });

      // when
      const screen = await renderScreen(hbs`
        <NewCertificationCandidateModal
          @showModal={{true}}
          @closeModal={{this.closeModal}}
          @countries={{this.countries}}
          @updateCandidateData={{this.updateCandidateStub}}
          @updateCandidateDataWithEvent={{this.updateCandidateStub}}
          @candidateData={{this.candidateData}}
        />
      `);

      await click(screen.getByRole('button', { name: 'Fermer' }));

      // then
      sinon.assert.calledOnce(closeModalStub);
      assert.ok(true);
    });
  });

  module('when a foreign country is selected', () => {
    test('it shows city field and hides insee code and postal code fields', async function (assert) {
      const closeModalStub = sinon.stub();
      const updateCandidateFromValueStub = sinon.stub();
      const updateCandidateFromEventStub = sinon.stub();
      this.set('closeModal', closeModalStub);
      this.set('updateCandidateFromValueStub', updateCandidateFromValueStub);
      this.set('updateCandidateFromEventStub', updateCandidateFromEventStub);
      this.set('countries', [{ code: '99123', name: 'Borduristan' }]);
      this.set('candidateData', {
        firstName: '',
        lastName: '',
        birthdate: '',
        birthCity: '',
        birthCountry: '',
        email: '',
        externalId: '',
        resultRecipientEmail: '',
        birthPostalCode: '',
        birthInseeCode: '',
        sex: '',
        extraTimePercentage: '',
      });

      // when
      const screen = await renderScreen(hbs`
        <NewCertificationCandidateModal
          @showModal={{true}}
          @closeModal={{this.closeModal}}
          @countries={{this.countries}}
          @updateCandidateData={{this.updateCandidateFromEventStub}}
          @updateCandidateDataFromValue={{this.updateCandidateFromValueStub}}
          @candidateData={{this.candidateData}}
        />
      `);

      await click(screen.getByRole('button', { name: 'Obligatoire Pays de naissance' }));
      await click(
        await screen.findByRole('option', {
          name: 'Borduristan',
        }),
      );

      // then
      assert.dom(screen.queryByLabelText('* Code INSEE de naissance')).isNotVisible();
      assert.dom(screen.queryByLabelText('* Code postal de naissance')).isNotVisible();
      assert.dom(screen.getByLabelText('* Commune de naissance')).isVisible();
    });
  });

  module('when the insee code option is selected', () => {
    test('it shows insee code field and hides postal code and city fields', async function (assert) {
      const closeModalStub = sinon.stub();
      const updateCandidateFromValueStub = sinon.stub();
      const updateCandidateFromEventStub = sinon.stub();
      this.set('closeModal', closeModalStub);
      this.set('updateCandidateFromValueStub', updateCandidateFromValueStub);
      this.set('updateCandidateFromEventStub', updateCandidateFromEventStub);
      this.set('countries', [{ code: '99123', name: 'Borduristan' }]);
      this.set('candidateData', {
        firstName: '',
        lastName: '',
        birthdate: '',
        birthCity: '',
        birthCountry: '',
        email: '',
        externalId: '',
        resultRecipientEmail: '',
        birthPostalCode: '',
        birthInseeCode: '',
        sex: '',
        extraTimePercentage: '',
      });

      // when
      const screen = await renderScreen(hbs`
        <NewCertificationCandidateModal
          @showModal={{true}}
          @closeModal={{this.closeModal}}
          @countries={{this.countries}}
          @updateCandidateData={{this.updateCandidateFromEventStub}}
          @updateCandidateDataFromValue={{this.updateCandidateFromValueStub}}
          @candidateData={{this.candidateData}}
        />
      `);
      await click(screen.getByRole('radio', { name: 'Code INSEE' }));

      // then
      assert.dom(screen.getByLabelText('* Code INSEE de naissance')).isVisible();
      assert.dom(screen.queryByLabelText('* Code postal de naissance')).isNotVisible();
      assert.dom(screen.queryByLabelText('* Commune de naissance')).isNotVisible();
    });
  });

  module('when the postal code option is selected', () => {
    test('it shows postal code and city fields and hides insee code field', async function (assert) {
      const closeModalStub = sinon.stub();
      const updateCandidateFromValueStub = sinon.stub();
      const updateCandidateFromEventStub = sinon.stub();
      this.set('closeModal', closeModalStub);
      this.set('updateCandidateFromValueStub', updateCandidateFromValueStub);
      this.set('updateCandidateFromEventStub', updateCandidateFromEventStub);
      this.set('countries', [{ code: '99123', name: 'Borduristan' }]);
      this.set('candidateData', {
        firstName: '',
        lastName: '',
        birthdate: '',
        birthCity: '',
        birthCountry: '',
        email: '',
        externalId: '',
        resultRecipientEmail: '',
        birthPostalCode: '',
        birthInseeCode: '',
        sex: '',
        extraTimePercentage: '',
      });

      // when
      const screen = await renderScreen(hbs`
        <NewCertificationCandidateModal
          @showModal={{true}}
          @closeModal={{this.closeModal}}
          @countries={{this.countries}}
          @updateCandidateData={{this.updateCandidateFromEventStub}}
          @updateCandidateDataFromValue={{this.updateCandidateFromValueStub}}
          @candidateData={{this.candidateData}}
        />
      `);

      await click(screen.getByRole('radio', { name: 'Code postal' }));

      // then
      assert.dom(screen.queryByLabelText('* Code INSEE de naissance')).isNotVisible();
      assert.dom(screen.queryByLabelText('* Code postal de naissance')).isVisible();
      assert.dom(screen.getByLabelText('* Commune de naissance')).isVisible();
    });
  });
});
