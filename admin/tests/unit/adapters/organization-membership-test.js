import { setupTest } from 'ember-qunit';
import ENV from 'pix-admin/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapter | organization-membership', function (hooks) {
  setupTest(hooks);

  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:organization-membership');
    sinon.stub(adapter, 'ajax').resolves();
  });

  hooks.afterEach(function () {
    adapter.ajax.restore();
  });

  module('#urlForQuery', function () {
    test('builds the correct url when organizationId is provided', function (assert) {
      // given
      const query = { filter: { organizationId: '42', firstName: 'John' } };

      // when
      const url = adapter.urlForQuery(query);

      // then
      assert.strictEqual(url, `${ENV.APP.API_HOST}/api/admin/organizations/42/memberships`);
      assert.notOk(query.filter.organizationId, 'organizationId is removed from filter');
      assert.strictEqual(query.filter.firstName, 'John');
    });

    test('delegates to super when no organizationId', function (assert) {
      // given
      const query = { filter: { firstName: 'John' } };

      // when / then
      assert.ok(adapter.urlForQuery(query));
    });
  });

  module('#deleteRecord', function () {
    module('when disabled adapter option is provided', function () {
      test('it should trigger a POST request to /admin/memberships/{id}/disable', async function (assert) {
        // when
        const data = {};
        await adapter.deleteRecord(
          {},
          { modelName: 'organizationMembership' },
          { id: 1, adapterOptions: { disable: true }, serialize: sinon.stub().returns(data) },
        );

        // then
        sinon.assert.calledWith(adapter.ajax, `${ENV.APP.API_HOST}/api/admin/memberships/1/disable`, 'POST', {
          data,
        });
        assert.ok(adapter); /* required because QUnit wants at least one expect (and does not accept Sinon's one) */
      });
    });
  });
});
