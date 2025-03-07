import { clickByName, fillByLabel, render as renderScreen } from '@1024pix/ember-testing-library';
import { hbs } from 'ember-cli-htmlbars';
import { t } from 'ember-intl/test-support';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | Campaign::UpdateForm', function (hooks) {
  setupIntlRenderingTest(hooks);
  let store;

  hooks.beforeEach(async function () {
    store = this.owner.lookup('service:store');

    this.campaign = await store.createRecord('campaign', { name: 'campaign', type: 'ASSESSMENT', ownerId: 666 });

    this.set('cancelSpy', () => {});
    this.set('updateCampaignSpy', (event) => event.preventDefault());
  });

  test('[a11y] it should display a message that some inputs are required', async function (assert) {
    // when
    const screen = await renderScreen(
      hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
    );

    // then
    assert.dom(screen.getByText('indique un champ obligatoire')).exists();
  });

  module('When campaign type is ASSESSMENT', function () {
    test('it should display campaign title input', async function (assert) {
      // when
      const screen = await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      // then
      assert.dom(screen.getByLabelText('Titre du parcours', { exact: false })).exists();
      assert.dom(screen.getByLabelText('Titre du parcours', { exact: false })).hasAttribute('maxLength', '50');
    });

    test('it should contain inputs, attributes, information block, validation and cancel buttons', async function (assert) {
      // when
      const screen = await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      // then
      assert.dom(screen.getByLabelText('Nom de la campagne *')).exists();
      assert.dom(screen.getByLabelText('Propriétaire de la campagne *')).exists();
      assert.dom(screen.getByLabelText("Texte de la page d'accueil", { exact: false })).exists();
      assert.dom(screen.getByLabelText('Titre du parcours', { exact: false })).exists();
      assert.dom(screen.getByText('Modifier')).exists();
      assert.dom(screen.getByText('Annuler')).exists();
    });

    test('it should send campaign update action when submitted', async function (assert) {
      // given
      this.campaign = await store.createRecord('campaign', {
        name: 'campaign',
        type: 'ASSESSMENT',
        ownerFirstName: 'Jon',
        ownerLastName: 'snow',
        ownerId: 666,
      });

      this.updateCampaignSpy = sinon.stub();

      await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      // when
      await fillByLabel('Nom de la campagne *', 'New name');
      await clickByName('Modifier');

      //then
      sinon.assert.called(this.updateCampaignSpy);
      assert.ok(true);
    });

    test('it should display campaign custom landing page input', async function (assert) {
      //when
      const screen = await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      //then
      assert
        .dom(screen.getByLabelText("Texte de la page d'accueil", { exact: false }))
        .hasAttribute('maxLength', '5000');
    });

    test('it should explain which informations will be visible to organization-learners', async function (assert) {
      //when
      const screen = await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      //then
      const testTitleSublabel = screen.getAllByLabelText(
        t('pages.campaign-modification.personalised-test-title.sublabel'),
        {
          exact: false,
        },
      )[0];
      const landingPageSublabel = screen.getAllByLabelText(
        t('pages.campaign-modification.landing-page-text.sublabel'),
        {
          exact: false,
        },
      )[1];

      assert.ok(testTitleSublabel);
      assert.ok(landingPageSublabel);
    });
  });

  module('When campaign type is EXAM', function (hooks) {
    hooks.beforeEach(async function () {
      this.campaign = await store.createRecord('campaign', { name: 'campaign', type: 'EXAM', ownerId: 666 });
    });

    test('it should display campaign title input', async function (assert) {
      // when
      const screen = await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      // then
      assert.dom(screen.getByLabelText('Titre du parcours', { exact: false })).exists();
      assert.dom(screen.getByLabelText('Titre du parcours', { exact: false })).hasAttribute('maxLength', '50');
    });

    test('it should contain inputs, attributes, information block, validation and cancel buttons', async function (assert) {
      // when
      const screen = await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      // then
      assert.dom(screen.getByLabelText('Nom de la campagne *')).exists();
      assert.dom(screen.getByLabelText('Propriétaire de la campagne *')).exists();
      assert.dom(screen.getByLabelText("Texte de la page d'accueil", { exact: false })).exists();
      assert.dom(screen.getByLabelText('Titre du parcours', { exact: false })).exists();
      assert.dom(screen.getByText('Modifier')).exists();
      assert.dom(screen.getByText('Annuler')).exists();
    });

    test('it should send campaign update action when submitted', async function (assert) {
      // given
      this.campaign = await store.createRecord('campaign', {
        name: 'campaign',
        type: 'ASSESSMENT',
        ownerFirstName: 'Jon',
        ownerLastName: 'snow',
        ownerId: 666,
      });

      this.updateCampaignSpy = sinon.stub();

      await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      // when
      await fillByLabel('Nom de la campagne *', 'New name');
      await clickByName('Modifier');

      //then
      sinon.assert.called(this.updateCampaignSpy);
      assert.ok(true);
    });

    test('it should display campaign custom landing page input', async function (assert) {
      //when
      const screen = await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      //then
      assert
        .dom(screen.getByLabelText("Texte de la page d'accueil", { exact: false }))
        .hasAttribute('maxLength', '5000');
    });

    test('it should explain which informations will be visible to organization-learners', async function (assert) {
      //when
      const screen = await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      //then
      const testTitleSublabel = screen.getAllByLabelText(
        t('pages.campaign-modification.personalised-test-title.sublabel'),
        {
          exact: false,
        },
      )[0];
      const landingPageSublabel = screen.getAllByLabelText(
        t('pages.campaign-modification.landing-page-text.sublabel'),
        {
          exact: false,
        },
      )[1];

      assert.ok(testTitleSublabel);
      assert.ok(landingPageSublabel);
    });
  });

  module('When campaign type is PROFILES_COLLECTION', function () {
    test('it should not display campaign title input', async function (assert) {
      // given
      this.campaign = await store.createRecord('campaign', {
        name: 'campaign',
        type: 'PROFILES_COLLECTION',
        ownerId: 666,
      });

      // when
      await renderScreen(
        hbs`<Campaign::UpdateForm @campaign={{this.campaign}} @onSubmit={{this.updateCampaignSpy}} @onCancel={{this.cancelSpy}} />`,
      );

      // then
      assert.dom('input#campaign-title').doesNotExist();
    });
  });
});
