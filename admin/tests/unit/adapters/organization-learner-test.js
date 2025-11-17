import { setupTest } from 'ember-qunit';
import ENV from 'pix-admin/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapter | organization-learner', function (hooks) {
  setupTest(hooks);

  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:organization-learner');
    adapter.ajax = sinon.stub();
  });

  module('#dissociate', function () {
    test('it performs the request to dissociate user from organization learner', async function (assert) {
      // given
      const organizationLearner = { id: 12345 };
      const expectedUrl = `${ENV.APP.API_HOST}/api/admin/organization-learners/${organizationLearner.id}/association`;

      // when
      adapter.dissociate(organizationLearner.id);

      // then
      assert.ok(adapter.ajax.calledWith(expectedUrl, 'DELETE'));
    });
  });

  module('#urlForDeleteRecord', function () {
    test('should build url to delete record', async function (assert) {
      // given
      const attrStub = (name) => {
        if (name === 'organizationId') return 777;
      };
      const snapshot = {
        attr: attrStub,
      };

      // when
      const url = await adapter.urlForDeleteRecord(123, 'organization-learner', snapshot);

      // then
      assert.true(url.endsWith('/organizations/777/organization-learners/123'), url);
    });
  });
});
