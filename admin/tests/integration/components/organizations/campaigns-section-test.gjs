import { render } from '@1024pix/ember-testing-library';
import CampaignsSection from 'pix-admin/components/organizations/campaigns-section';
import { module, test } from 'qunit';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | organizations/campaigns-section', function (hooks) {
  setupIntlRenderingTest(hooks);
  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  module('when there is no campaigns', function () {
    test('it should display aucune campagne', async function (assert) {
      // given
      const campaigns = [];

      // when
      const screen = await render(<template><CampaignsSection @campaigns={{campaigns}} /></template>);

      // then
      assert.dom(screen.getByText('Aucune campagne')).exists();
    });
  });

  module('when there are campaigns', function () {
    test('it should display campaign columns', async function (assert) {
      // given
      const campaign = store.createRecord('campaign', {
        id: 1,
        name: 'Nom de campagne 1',
        archivedAt: new Date('2021-01-01'),
        type: 'ASSESSMENT',
        code: '123',
        targetProfileId: 1,
        targetProfileName: 'Nom du profil cible',
        createdAt: new Date('2021-01-02'),
        creatorLastName: 'K',
        creatorFirstName: 'K',
      });
      const campaigns = [campaign];
      campaigns.meta = { rowCount: 1 };

      // when
      const screen = await render(<template><CampaignsSection @campaigns={{campaigns}} /></template>);

      // then
      assert.dom(screen.getByText('Code')).exists();
      assert.dom(screen.getByText('Nom')).exists();
      assert.dom(screen.getByText('Type')).exists();
      assert.dom(screen.getByText('Profil cible')).exists();
      assert.dom(screen.getByText('Créée le')).exists();
      assert.dom(screen.getByText('Créée par')).exists();
      assert.dom(screen.getByText('Propriétaire')).exists();
      assert.dom(screen.getByText('Archivée le')).exists();
      assert.dom(screen.getByText('Supprimée le')).exists();
    });

    test('it should display a list of campaigns', async function (assert) {
      const campaign1 = store.createRecord('campaign', {
        id: 1,
        name: 'Nom de campagne 1',
        archivedAt: new Date('2021-01-01'),
        type: 'ASSESSMENT',
        code: '123',
        createdAt: new Date('2021-01-02'),
        creatorLastName: 'King',
        creatorFirstName: 'Karam',
        targetProfileId: 1,
        targetProfileName: 'Nom du profil cible',
      });
      const campaign2 = store.createRecord('campaign', {
        id: 2,
        name: 'Nom de campagne 2',
        archivedAt: new Date('2021-01-03'),
        type: 'PROFILES_COLLECTION',
        code: '456',
        createdAt: new Date('2021-01-04'),
        creatorLastName: 'JJ',
        creatorFirstName: 'AA',
        targetProfileId: null,
        targetProfileName: null,
      });
      const campaigns = [campaign1, campaign2];
      campaigns.meta = { rowCount: 2 };

      // when
      const screen = await render(<template><CampaignsSection @campaigns={{campaigns}} /></template>);

      // then
      assert.strictEqual(screen.getAllByRole('row').length, 3);
    });

    test('it should display information of each campaigns', async function (assert) {
      const campaign1 = store.createRecord('campaign', {
        id: 1,
        name: 'Nom de campagne 1',
        archivedAt: new Date('2021-01-01'),
        deletedAt: new Date('2023-12-31'),
        type: 'ASSESSMENT',
        code: '123',
        createdAt: new Date('2021-01-02'),
        creatorLastName: 'King',
        creatorFirstName: 'Karam',
        ownerLastName: 'Di',
        ownerFirstName: 'Amar',
        targetProfileId: 1,
        targetProfileName: 'Nom du profil cible',
      });
      const campaign2 = store.createRecord('campaign', {
        id: 2,
        name: 'Nom de campagne 2',
        archivedAt: new Date('2021-01-03'),
        type: 'PROFILES_COLLECTION',
        code: '456',
        createdAt: new Date('2021-01-04'),
        creatorLastName: 'Elizabeth',
        creatorFirstName: 'Queen',
        ownerLastName: 'Credi',
        ownerFirstName: 'Amer',
        targetProfileId: null,
        targetProfileName: null,
      });
      const campaigns = [campaign1, campaign2];
      campaigns.meta = { rowCount: 2 };

      // when
      const screen = await render(<template><CampaignsSection @campaigns={{campaigns}} /></template>);

      // then
      assert.dom(screen.getByRole('link', { name: '123' })).exists();
      assert.dom(screen.getByText('123')).exists();
      assert.dom(screen.getByTitle("Campagne d'évaluation")).exists();
      assert.dom(screen.getByText('Nom de campagne 1')).exists();
      assert.dom(screen.getByText('Karam King')).exists();
      assert.dom(screen.getByText('Amar Di')).exists();
      assert.dom(screen.getByRole('link', { name: 'Nom du profil cible' })).exists();
      assert.dom(screen.getByText('01/01/2021')).exists();
      assert.dom(screen.getByText('02/01/2021')).exists();
      assert.dom(screen.getByText('31/12/2023')).exists();

      assert.dom(screen.getByRole('link', { name: '456' })).exists();
      assert.dom(screen.getByText('456')).exists();
      assert.dom(screen.getByTitle('Campagne de collecte de profil')).exists();
      assert.dom(screen.getByText('Nom de campagne 2')).exists();
      assert.dom(screen.getByText('Queen Elizabeth')).exists();
      assert.dom(screen.getByText('Amer Credi')).exists();
      assert.dom(screen.getByText('03/01/2021')).exists();
      assert.dom(screen.getByText('04/01/2021')).exists();
    });

    test('it should display - when there is no archivedAt date', async function (assert) {
      // given
      const campaign = store.createRecord('campaign', {
        id: 1,
        name: 'Nom de campagne 1',
        archivedAt: null,
        deletedAt: new Date('2021-01-02'),
        type: 'ASSESSMENT',
        code: '123',
        createdAt: new Date('2021-01-02'),
        creatorLastName: 'King',
        creatorFirstName: 'Karam',
      });
      const campaigns = [campaign];
      campaigns.meta = { rowCount: 1 };

      // when
      const screen = await render(<template><CampaignsSection @campaigns={{campaigns}} /></template>);

      // then
      assert.dom(screen.getByText('-')).exists();
    });

    test('it should display - when there is no deletedAt date', async function (assert) {
      // given
      const campaign = store.createRecord('campaign', {
        id: 1,
        name: 'Nom de campagne 1',
        archivedAt: new Date('2021-01-02'),
        deletedAt: null,
        type: 'ASSESSMENT',
        code: '123',
        createdAt: new Date('2021-01-02'),
        creatorLastName: 'King',
        creatorFirstName: 'Karam',
      });
      const campaigns = [campaign];
      campaigns.meta = { rowCount: 1 };

      // when
      const screen = await render(<template><CampaignsSection @campaigns={{campaigns}} /></template>);

      // then
      assert.dom(screen.getByText('-')).exists();
    });
  });
});
