import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | modules | module', function (hooks) {
  setupTest(hooks);

  test('should exist', function (assert) {
    // when
    const route = this.owner.lookup('route:module');

    // then
    assert.ok(route);
  });

  test('should load the corresponding model', async function (assert) {
    // given
    const route = this.owner.lookup('route:module');
    const store = this.owner.lookup('service:store');

    const module = Symbol('the-module');

    store.queryRecord = sinon.stub();
    store.queryRecord.withArgs('module', { slug: 'the-module', encryptedRedirectionUrl: 'somehash' }).resolves(module);

    // when
    const model = await route.model({ slug: 'the-module', redirection: 'somehash' });

    // then
    assert.strictEqual(model, module);
  });
});
