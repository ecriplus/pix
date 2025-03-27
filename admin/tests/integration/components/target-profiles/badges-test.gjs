import { clickByName, render, within } from '@1024pix/ember-testing-library';
import EmberObject from '@ember/object';
import Badges from 'pix-admin/components/target-profiles/badges';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest, { t } from '../../../helpers/setup-intl-rendering';

module('Integration | Component | TargetProfiles::Badges', function (hooks) {
  setupIntlRenderingTest(hooks);

  module('when there is no badge', function () {
    test('it should display a message when empty', async function (assert) {
      // given
      const badges = [];

      // when
      const screen = await render(<template><Badges @badges={{badges}} /></template>);

      // then
      assert.dom('table').doesNotExist();
      assert.dom(screen.getByText('Aucun résultat thématique associé')).exists();
    });
  });

  module('when there is some badges', function () {
    test('it should display the items', async function (assert) {
      // given
      const badges = [
        EmberObject.create({
          id: 1,
          key: 'My key',
          title: 'My title',
          message: 'My message',
          imageUrl: 'data:,',
          altMessage: 'My alt message',
        }),
      ];

      // when
      const screen = await render(<template><Badges @badges={{badges}} /></template>);

      // then
      assert.dom(screen.queryByText('Aucun résultat thématique associé')).doesNotExist();
      const table = screen.getByRole('table', { name: t('components.target-profiles.badges.table.caption') });
      assert.dom(within(table).getByRole('columnheader', { name: 'ID' })).exists();
      assert.dom(within(table).getByRole('columnheader', { name: 'Image' })).exists();
      assert.dom(within(table).getByRole('columnheader', { name: 'Clé' })).exists();
      assert.dom(within(table).getByRole('columnheader', { name: 'Nom' })).exists();
      assert.dom(within(table).getByRole('columnheader', { name: 'Message' })).exists();
      assert.dom(within(table).getByRole('columnheader', { name: 'Paramètres' })).exists();
      assert.dom(within(table).getByRole('columnheader', { name: 'Actions' })).exists();

      assert.dom(within(table).getByRole('cell', { name: 'Voir le détail du résultat thématique ID 1' })).exists();

      assert.dom(within(table).getByRole('img', { name: 'My alt message' })).exists();
      assert.dom(screen.getAllByRole('cell')[1].children[0]).hasAttribute('src', 'data:,');
      assert.dom(within(table).getByRole('cell', { name: 'My key' })).exists();
      assert.dom(within(table).getByRole('cell', { name: 'My title' })).exists();
      assert.dom(within(table).getByRole('cell', { name: 'My message' })).exists();
      assert.dom(within(table).getByRole('cell', { name: 'Pas en lacune Pas certifiable' })).exists();
      assert.dom(within(table).getByRole('button', { name: 'Supprimer le résultat thématique My title' })).exists();
    });

    module('when the badge is always visible', function () {
      test('it should display an always visible tag', async function (assert) {
        // given
        const badges = [
          EmberObject.create({
            isAlwaysVisible: true,
          }),
        ];

        // when
        const screen = await render(<template><Badges @badges={{badges}} /></template>);

        // then
        assert.dom(screen.queryByText('Pas en lacune')).doesNotExist();
        const table = screen.getByRole('table', { name: t('components.target-profiles.badges.table.caption') });
        assert.dom(within(table).getByRole('cell', { name: 'En lacune Pas certifiable' })).exists();
      });
    });

    module('when the badge is certifiable', function () {
      test('it should display a certifiable tag', async function (assert) {
        // given
        const badges = [
          EmberObject.create({
            isCertifiable: true,
          }),
        ];

        // when
        const screen = await render(<template><Badges @badges={{badges}} /></template>);

        // then
        assert.dom(screen.queryByText('Pas certifiable')).doesNotExist();
        const table = screen.getByRole('table', { name: t('components.target-profiles.badges.table.caption') });
        assert.dom(within(table).getByRole('cell', { name: 'Pas en lacune Certifiable' })).exists();
      });
    });

    module('when there is multiple badges', function () {
      test('it should display a specific row for each badge', async function (assert) {
        // given
        const badges = [
          EmberObject.create({
            id: 1,
            title: 'First badge',
          }),
          EmberObject.create({
            id: 2,
            title: 'Second badge',
          }),
        ];

        // when
        const screen = await render(<template><Badges @badges={{badges}} /></template>);

        // then
        const table = screen.getByRole('table', { name: t('components.target-profiles.badges.table.caption') });
        const rows = within(table).getAllByRole('row');
        assert.strictEqual(rows.length, 3);
      });
    });
  });

  module('when deleting a badge', function (hooks) {
    let badge;

    hooks.beforeEach(async function () {
      const store = this.owner.lookup('service:store');
      badge = store.push({
        data: {
          id: 'badgeId',
          type: 'badge',
          attributes: {
            key: 'My key',
            title: 'My title',
            message: 'My message',
            imageUrl: 'data:,',
            altMessage: 'My alt message',
          },
        },
      });
      badge.destroyRecord = sinon.stub();
    });

    test('should open confirm modal', async function (assert) {
      //given
      const badges = [badge];

      // when
      const screen = await render(<template><Badges @badges={{badges}} /></template>);
      await clickByName(/Supprimer/);
      await screen.findByRole('dialog');

      // then
      assert.dom(screen.getByRole('heading', { name: "Suppression d'un résultat thématique" })).exists();
      assert
        .dom(
          screen.getByText(
            "Êtes-vous sûr de vouloir supprimer ce résultat thématique ? (Uniquement si le RT n'a pas encore été assigné)",
          ),
        )
        .exists();
    });

    test('should delete the badge on confirmation click', async function (assert) {
      //given
      const badges = [badge];

      // when
      const screen = await render(<template><Badges @badges={{badges}} /></template>);
      await clickByName(/Supprimer/);
      await screen.findByRole('dialog');
      await clickByName('Confirmer');

      // then
      assert.ok(badge.destroyRecord.called);
    });
  });
});
