import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import createGlimmerComponent from '../../../../../helpers/create-glimmer-component';

module('Unit | Component | complementary-certifications/item/target-profile/badges-list', function (hooks) {
  setupTest(hooks);

  test('it should display current target profile badges', async function (assert) {
    // given
    const component = createGlimmerComponent('component:complementary-certifications/item/target-profile/badges-list');

    component.args = {
      currentTargetProfile: {
        id: 1,
        name: 'current target',
        badges: [{ id: 1, level: 2, label: 'badge Pluie', imageUrl: 'http://badge-pluie.net', minimumEarnedPix: 0 }],
      },
    };

    // when & then
    assert.deepEqual(component.currentTargetProfileBadges, [
      { id: 1, level: 2, label: 'badge Pluie', imageUrl: 'http://badge-pluie.net', minimumEarnedPix: 0 },
    ]);
  });

  test('it should not display minimum earned pix if it is zero ', async function (assert) {
    // given
    const component = createGlimmerComponent('component:complementary-certifications/item/target-profile/badges-list');
    const minimumEarnedPix = 0;

    // when & then
    assert.strictEqual(component.getMinimumEarnedPixValue(minimumEarnedPix), '');
  });
});
