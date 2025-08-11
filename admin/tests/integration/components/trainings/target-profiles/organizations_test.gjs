import { render } from '@1024pix/ember-testing-library';
import Service from '@ember/service';
import { click } from '@ember/test-helpers';
import Organizations from 'pix-admin/components/trainings/target-profiles/organizations';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../../helpers/setup-intl-rendering';

module('Integration | Components | Trainings | Training | Target Profiles | Organizations', function (hooks) {
  setupIntlRenderingTest(hooks);

  test('it should display organizations', async function (assert) {
    // given
    const store = this.owner.lookup('service:store');
    const targetProfile = store.createRecord('target-profile', { internalName: 'Profil cible 1' });
    const organization = store.createRecord('organization', {
      id: 'org1',
      name: 'Organisation 1',
      type: 'Type A',
      externalId: 'ext-org1',
    });
    const organizations = [organization];

    const controller = {
      id: '',
      name: '',
      externalId: '',
      type: '',
    };

    // when
    const screen = await render(
      <template>
        <Organizations @controller={{controller}} @organizations={{organizations}} @targetProfile={{targetProfile}} />
      </template>,
    );

    // then
    assert.dom(screen.getByRole('heading', { name: 'Profil cible 1' })).exists();
    assert.dom(screen.getByRole('heading', { name: 'Filtrer par organisations' })).exists();
    assert.dom(screen.getByRole('cell', { name: 'Organisation 1' })).exists();
  });

  module('when clicking on cancel button', function () {
    test('it should transition to target profiles page', async function (assert) {
      // given
      const transitionToSpy = stubRouter(this);

      const controller = {
        id: '',
        name: '',
        externalId: '',
        type: '',
      };

      const screen = await render(
        <template><Organizations @controller={{controller}} @targetProfile={{this.targetProfile}} /></template>,
      );

      // when
      await click(screen.getByRole('button', { name: 'Annuler' }));

      // then
      assert.ok(transitionToSpy.calledWith('authenticated.trainings.training.target-profiles'));
    });
  });

  module('when clicking on save button', function () {
    test('it should transition to target profiles page', async function (assert) {
      // given
      const transitionToSpy = stubRouter(this);

      const controller = {
        id: '',
        name: '',
        externalId: '',
        type: '',
      };

      const screen = await render(
        <template><Organizations @controller={{controller}} @targetProfile={{this.targetProfile}} /></template>,
      );

      // when
      await click(screen.getByRole('button', { name: 'Enregistrer' }));

      // then
      assert.ok(transitionToSpy.calledWith('authenticated.trainings.training.target-profiles'));
    });
  });
});

function stubRouter(self) {
  const transitionToSpy = sinon.spy();
  class RouterStub extends Service {
    transitionTo = transitionToSpy;
    currentRoute = {
      parent: {
        parent: {
          params: {
            training_id: 'training1',
          },
        },
      },
    };
  }
  self.owner.register('service:router', RouterStub);
  return transitionToSpy;
}
