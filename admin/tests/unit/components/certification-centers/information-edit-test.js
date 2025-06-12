import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import createGlimmerComponent from '../../../helpers/create-glimmer-component';

module('Unit | Component | certification-centers/information-edit', function (hooks) {
  setupTest(hooks);

  let component, store;

  hooks.beforeEach(function () {
    store = this.owner.lookup('service:store');
    component = createGlimmerComponent('component:certification-centers/information-edit', {
      availableHabilitations: [],
      certificationCenter: store.createRecord('certification-center'),
      onSubmit: sinon.stub(),
      toggleEditMode: sinon.stub(),
    });
  });

  module('#sortedHabilitations', function () {
    test('it should return a sorted list of available habilitations', async function (assert) {
      // given
      const component = createGlimmerComponent('component:certification-centers/information-edit', {
        availableHabilitations: [{ id: 321 }, { id: 21 }, { id: 1 }],
        certificationCenter: {
          id: 1,
          getProperties: sinon.stub().returns({}),
          habilitations: [],
        },
        onSubmit: sinon.stub(),
      });

      // when & then
      assert.strictEqual(component.sortedHabilitations.length, 3);
      assert.strictEqual(component.sortedHabilitations[0].id, 1);
      assert.strictEqual(component.sortedHabilitations[2].id, 321);
    });
  });

  module('#onTypeChange', function () {
    test('it should update the certification center type', function (assert) {
      // given & when
      component.onTypeChange('My Super Duper Type');

      // then
      assert.strictEqual(component.form.type, 'My Super Duper Type');
    });
  });
});
