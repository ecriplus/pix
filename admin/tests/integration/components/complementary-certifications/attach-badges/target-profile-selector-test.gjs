import { fillByLabel, render } from '@1024pix/ember-testing-library';
import { click, settled } from '@ember/test-helpers';
import TargetProfileSelector from 'pix-admin/components/complementary-certifications/attach-badges/target-profile-selector';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module(
  'Integration | Component | complementary-certifications/attach-badges/target-profile-selector',
  function (hooks) {
    setupIntlRenderingTest(hooks);

    let store;

    hooks.beforeEach(function () {
      store = this.owner.lookup('service:store');
    });

    module('Search functionality', function () {
      test('should not search when search term is empty', async function (assert) {
        // given
        const onSelectionStub = sinon.stub();
        const onChangeStub = sinon.stub();
        const onErrorStub = sinon.stub();
        sinon.stub(store, 'query');

        // when
        const screen = await render(
          <template>
            <TargetProfileSelector
              @onSelection={{onSelectionStub}}
              @onChange={{onChangeStub}}
              @onError={{onErrorStub}}
            />
          </template>,
        );

        await fillByLabel('ID du profil cible', '');
        await settled();

        // then
        assert.ok(store.query.notCalled);
        assert.dom(screen.queryByText('Aucun résultat trouvé')).doesNotExist();
      });

      test('should search by ID when search term is a number', async function (assert) {
        // given
        const onSelectionStub = sinon.stub();
        const onChangeStub = sinon.stub();
        const onErrorStub = sinon.stub();
        const attachableTargetProfile = store.createRecord('attachable-target-profile', {
          id: 12,
          name: 'target-profile',
        });
        sinon.stub(store, 'query').resolves([attachableTargetProfile]);

        // when
        const screen = await render(
          <template>
            <TargetProfileSelector
              @onSelection={{onSelectionStub}}
              @onChange={{onChangeStub}}
              @onError={{onErrorStub}}
            />
          </template>,
        );

        await fillByLabel('ID du profil cible', '12');
        await settled();

        // then
        assert.ok(store.query.calledWithExactly('attachable-target-profile', { searchTerm: '12' }));
        assert.dom(screen.getByText('12 - target-profile')).exists();
      });

      test('should search by name when search term has 2 or more characters', async function (assert) {
        // given
        const onSelectionStub = sinon.stub();
        const onChangeStub = sinon.stub();
        const onErrorStub = sinon.stub();
        const attachableTargetProfile = store.createRecord('attachable-target-profile', {
          id: 12,
          name: 'target-profile',
        });
        sinon.stub(store, 'query').resolves([attachableTargetProfile]);

        // when
        const screen = await render(
          <template>
            <TargetProfileSelector
              @onSelection={{onSelectionStub}}
              @onChange={{onChangeStub}}
              @onError={{onErrorStub}}
            />
          </template>,
        );

        await fillByLabel('ID du profil cible', 'tar');
        await settled();

        // then
        assert.ok(store.query.calledWithExactly('attachable-target-profile', { searchTerm: 'tar' }));
        assert.dom(screen.getByText('12 - target-profile')).exists();
      });

      test('should not search when search term has less than 2 characters and is not a number', async function (assert) {
        // given
        const onSelectionStub = sinon.stub();
        const onChangeStub = sinon.stub();
        const onErrorStub = sinon.stub();
        sinon.stub(store, 'query');

        // when
        const screen = await render(
          <template>
            <TargetProfileSelector
              @onSelection={{onSelectionStub}}
              @onChange={{onChangeStub}}
              @onError={{onErrorStub}}
            />
          </template>,
        );

        await fillByLabel('ID du profil cible', 't');
        await settled();

        // then
        assert.ok(store.query.notCalled);
        assert.dom(screen.queryByText('Aucun résultat trouvé')).doesNotExist();
      });

      test('should show no results message when search returns empty', async function (assert) {
        // given
        const onSelectionStub = sinon.stub();
        const onChangeStub = sinon.stub();
        const onErrorStub = sinon.stub();
        sinon.stub(store, 'query').resolves([]);

        // when
        const screen = await render(
          <template>
            <TargetProfileSelector
              @onSelection={{onSelectionStub}}
              @onChange={{onChangeStub}}
              @onError={{onErrorStub}}
            />
          </template>,
        );

        await fillByLabel('ID du profil cible', 'nonexistent');
        await settled();

        // then
        assert.dom(screen.getByText('Aucun résultat')).exists();
      });

      test('should call onError when search fails', async function (assert) {
        // given
        const onSelectionStub = sinon.stub();
        const onChangeStub = sinon.stub();
        const onErrorStub = sinon.stub();
        sinon.stub(store, 'query').rejects(new Error('Search failed'));

        // when
        await render(
          <template>
            <TargetProfileSelector
              @onSelection={{onSelectionStub}}
              @onChange={{onChangeStub}}
              @onError={{onErrorStub}}
            />
          </template>,
        );

        await fillByLabel('ID du profil cible', 'search');
        await settled();

        // then
        assert.ok(onErrorStub.calledWith('Une erreur est survenue lors de la recherche de profils cibles.'));
      });
    });

    module('Selection functionality', function () {
      test('should handle selection and call onSelection callback', async function (assert) {
        // given
        const onSelectionStub = sinon.stub();
        const onChangeStub = sinon.stub();
        const onErrorStub = sinon.stub();
        const attachableTargetProfile = store.createRecord('attachable-target-profile', {
          id: 12,
          name: 'target-profile',
        });
        sinon.stub(store, 'query').resolves([attachableTargetProfile]);

        // when
        const screen = await render(
          <template>
            <TargetProfileSelector
              @onSelection={{onSelectionStub}}
              @onChange={{onChangeStub}}
              @onError={{onErrorStub}}
            />
          </template>,
        );

        await fillByLabel('ID du profil cible', 'tar');
        await settled();
        await click(screen.getByText('12 - target-profile'));

        // then
        assert.ok(onSelectionStub.calledWith(attachableTargetProfile));
      });

      test('should show selected target profile after selection', async function (assert) {
        // given
        const onSelectionStub = sinon.stub();
        const onChangeStub = sinon.stub();
        const onErrorStub = sinon.stub();
        const attachableTargetProfile = store.createRecord('attachable-target-profile', {
          id: 12,
          name: 'target-profile',
        });
        sinon.stub(store, 'query').resolves([attachableTargetProfile]);

        // when
        const screen = await render(
          <template>
            <TargetProfileSelector
              @onSelection={{onSelectionStub}}
              @onChange={{onChangeStub}}
              @onError={{onErrorStub}}
            />
          </template>,
        );

        await fillByLabel('ID du profil cible', 'tar');
        await settled();
        await click(screen.getByText('12 - target-profile'));

        // then
        assert.dom(screen.getByText('target-profile')).exists();
        assert.dom(screen.queryByLabelText('ID du profil cible')).doesNotExist();
      });
    });

    module('Change functionality', function () {
      test('should reset selection and call onChange when change button is clicked', async function (assert) {
        // given
        const onSelectionStub = sinon.stub();
        const onChangeStub = sinon.stub();
        const onErrorStub = sinon.stub();
        const attachableTargetProfile = store.createRecord('attachable-target-profile', {
          id: 12,
          name: 'target-profile',
        });
        sinon.stub(store, 'query').resolves([attachableTargetProfile]);

        // when
        const screen = await render(
          <template>
            <TargetProfileSelector
              @onSelection={{onSelectionStub}}
              @onChange={{onChangeStub}}
              @onError={{onErrorStub}}
            />
          </template>,
        );

        // Select a target profile first
        await fillByLabel('ID du profil cible', 'tar');
        await settled();
        await click(screen.getByText('12 - target-profile'));

        // Then change it
        await click(screen.getByRole('button', { name: 'Changer' }));

        // then
        assert.ok(onChangeStub.called);
        assert.dom(screen.getByLabelText('ID du profil cible')).exists();
        assert.dom(screen.queryByText('target-profile')).doesNotExist();
      });
    });
  },
);
