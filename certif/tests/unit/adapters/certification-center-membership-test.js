import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapter | certificationCenterMembership', function (hooks) {
  setupTest(hooks);

  let adapter;

  hooks.beforeEach(function () {
    adapter = this.owner.lookup('adapter:certification-center-membership');
    adapter.ajax = sinon.stub().resolves();
  });

  module('#updateRecord', function () {
    module('when updateLastAccessedAt is true', function () {
      test('should call /api/certification-centers/{certification-center-id}/certification-center-memberships/me', async function (assert) {
        // given

        const snapshot = {
          id: 1,
          adapterOptions: {
            updateLastAccessedAt: true,
          },
        };
        const expectedUrl = `http://localhost:3000/api/certification-center-memberships/1/access`;
        const expectedMethod = 'POST';

        // when
        await adapter.updateRecord(null, null, snapshot);

        // then
        sinon.assert.calledWith(adapter.ajax, expectedUrl, expectedMethod);
        assert.ok(true);
      });
    });
  });
});
