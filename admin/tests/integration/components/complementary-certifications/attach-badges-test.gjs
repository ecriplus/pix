import { fillByLabel, render } from '@1024pix/ember-testing-library';
import { click, settled } from '@ember/test-helpers';
import AttachBadges from 'pix-admin/components/complementary-certifications/attach-badges';
import { module, test } from 'qunit';
import sinon from 'sinon';

import setupIntlRenderingTest from '../../../helpers/setup-intl-rendering';

module('Integration | Component | complementary-certifications/attach-badges', function (hooks) {
  setupIntlRenderingTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  test('should reset state when target profile selector is changed', async function (assert) {
    // given
    const complementaryCertification = store.createRecord('complementary-certification', {
      label: 'Test Certification',
      hasExternalJury: false,
    });
    const currentTargetProfile = store.createRecord('target-profile', {
      name: 'Current Profile',
    });
    const attachableTargetProfile = store.createRecord('attachable-target-profile', {
      id: 12,
      name: 'New Target Profile',
    });
    sinon.stub(store, 'query').resolves([attachableTargetProfile]);

    // when
    const screen = await render(
      <template>
        <AttachBadges
          @complementaryCertification={{complementaryCertification}}
          @currentTargetProfile={{currentTargetProfile}}
        />
      </template>,
    );

    // Select a target profile
    await fillByLabel('ID du profil cible', 'New');
    await settled();
    await click(screen.getByText('12 - New Target Profile'));

    // Verify the target profile is selected
    assert.dom(screen.getByText('New Target Profile')).exists();
    assert.dom(screen.getByText('2. Complétez les informations des badges')).exists();

    // Reset by clicking the change button
    await click(screen.getByRole('button', { name: 'Changer' }));

    // then - verify state is reset
    assert.dom(screen.getByLabelText('ID du profil cible')).exists();
    assert.dom(screen.queryByText('New Target Profile')).doesNotExist();
    assert.dom(screen.queryByText('2. Complétez les informations des badges')).doesNotExist();
  });

  test('should display form sections when target profile is selected', async function (assert) {
    // given
    const complementaryCertification = store.createRecord('complementary-certification', {
      label: 'Test Certification',
      hasExternalJury: false,
    });
    const currentTargetProfile = store.createRecord('target-profile', {
      name: 'Current Profile',
    });
    const attachableTargetProfile = store.createRecord('attachable-target-profile', {
      id: 12,
      name: 'Target Profile',
      badges: [{ id: 1, label: 'Badge 1' }],
    });
    sinon.stub(store, 'query').resolves([attachableTargetProfile]);

    // when
    const screen = await render(
      <template>
        <AttachBadges
          @complementaryCertification={{complementaryCertification}}
          @currentTargetProfile={{currentTargetProfile}}
        />
      </template>,
    );

    // Initially only show the target profile selector
    assert.dom(screen.getByText('1. Renseigner le nouveau profil cible à rattacher')).exists();
    assert.dom(screen.queryByText('2. Complétez les informations des badges')).doesNotExist();

    // Select a target profile
    await fillByLabel('ID du profil cible', 'Target');
    await settled();
    await click(screen.getByText('12 - Target Profile'));

    // then - verify both sections are shown
    assert.dom(screen.getByText('1. Renseigner le nouveau profil cible à rattacher')).exists();
    assert.dom(screen.getByText('2. Complétez les informations des badges')).exists();
  });
});
