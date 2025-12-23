import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Model | certification-framework', function (hooks) {
  setupTest(hooks);

  let store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
  });

  test('it should have a name and activeVersionStartDate attributes', function (assert) {
    // given
    const certificationFramework = store.createRecord('certification-framework', {
      id: 'CORE',
      name: 'Pix',
      activeVersionStartDate: new Date('2024-01-01'),
    });

    // when
    const { name, activeVersionStartDate } = certificationFramework;

    // then
    assert.strictEqual(name, 'Pix');
    assert.ok(activeVersionStartDate instanceof Date);
  });

  test('it should handle null activeVersionStartDate', function (assert) {
    // given
    const certificationFramework = store.createRecord('certification-framework', {
      id: 'DROIT',
      name: 'Pix+Droit',
      activeVersionStartDate: null,
    });

    // when
    const { activeVersionStartDate } = certificationFramework;

    // then
    assert.strictEqual(activeVersionStartDate, null);
  });
});
