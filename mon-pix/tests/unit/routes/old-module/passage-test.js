import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | old-module | passage', function (hooks) {
  setupTest(hooks);

  test('should redirect to resume route', async function (assert) {
    // given
    const route = this.owner.lookup('route:old-module.passage');
    route.router = { replaceWith: sinon.stub() };

    // when
    await route.redirect({ slug: 'bac-a-sable', shortId: 1 });

    // then
    sinon.assert.calledWith(route.router.replaceWith, 'module.passage', 1, 'bac-a-sable');
    assert.ok(true);
  });
});
