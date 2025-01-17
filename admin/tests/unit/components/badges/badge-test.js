import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

import createComponent from '../../../helpers/create-glimmer-component';

module('Unit | Component | Badges | badge', function (hooks) {
  setupTest(hooks);

  module('isCertifiable', function () {
    test('returns text when is certifiable', function (assert) {
      // given & when
      const component = createComponent('component:badges/badge', {
        badge: { isCertifiable: true, criteria: [] },
      });

      // then
      assert.strictEqual(component.isCertifiableText, 'Certifiable');
    });
  });

  module('isAlwaysVisible', function () {
    test('returns text when is always visible', function (assert) {
      // given & when
      const component = createComponent('component:badges/badge', {
        badge: { isAlwaysVisible: true, criteria: [] },
      });

      // then
      assert.strictEqual(component.isAlwaysVisibleText, 'Lacunes');
    });
  });
});
