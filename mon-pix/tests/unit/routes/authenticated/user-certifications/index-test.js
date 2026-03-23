import EmberObject from '@ember/object';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | user certifications/index', function (hooks) {
  setupTest(hooks);

  test('should return connected user certifications', async function (assert) {
    // given
    const certifications = [EmberObject.create({ id: '1' })];
    const route = this.owner.lookup('route:authenticated/user-certifications/index');
    sinon.stub(route, 'modelFor').withArgs('authenticated.user-certifications').returns(certifications);

    // when
    const result = route.model();

    // then
    assert.strictEqual(result[0].id, '1');
  });
});
