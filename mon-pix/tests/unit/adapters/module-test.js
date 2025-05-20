import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapter | Module | Module', function (hooks) {
  setupTest(hooks);

  module('#queryRecord', function () {
    module('when query.slug is not defined', function () {
      test('should trigger an ajax call with the default url and method', async function (assert) {
        // given
        const query = {
          'other-prop': 'bac-a-sable',
        };

        const store = this.owner.lookup('service:store');
        const adapter = this.owner.lookup('adapter:module');
        const type = { modelName: 'module' };
        sinon.stub(adapter, 'ajax').resolves();
        const expectedUrl = `http://localhost:3000/api/modules`;

        // when
        await adapter.queryRecord(store, type, query);

        // then
        sinon.assert.calledWithExactly(adapter.ajax, expectedUrl, 'GET', { data: { 'other-prop': 'bac-a-sable' } });
        assert.ok(true);
      });
    });

    module('when query.slug is defined', function () {
      test('should trigger an ajax call with the right url and method', async function (assert) {
        // given
        const query = {
          slug: 'bac-a-sable',
        };

        const store = this.owner.lookup('service:store');
        const adapter = this.owner.lookup('adapter:module');
        const type = { modelName: 'module' };
        sinon.stub(adapter, 'ajax').resolves();
        const expectedUrl = `http://localhost:3000/api/modules/${query.slug}`;

        // when
        await adapter.queryRecord(store, type, query);

        // then
        sinon.assert.calledWith(adapter.ajax, expectedUrl, 'GET');
        assert.ok(true);
      });
    });
  });
});
