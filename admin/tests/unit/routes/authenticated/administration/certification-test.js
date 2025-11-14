import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/administration/certification', function (hooks) {
  setupTest(hooks);

  module('#model', function () {
    test('it should return the correct model', async function (assert) {
      // given
      const queryRecordStub = sinon.stub();
      const findAllStub = sinon.stub();
      class StoreStub extends Service {
        queryRecord = queryRecordStub;
        findAll = findAllStub;
      }
      this.owner.register('service:store', StoreStub);
      const route = this.owner.lookup('route:authenticated/administration/certification');
      const certificationVersion = Symbol(' certification version');
      const scoBlockedAccessDates = Symbol('sco blocked access date');
      queryRecordStub.withArgs('certification-version', { scope: 'CORE' }).resolves(certificationVersion);
      findAllStub.withArgs('sco-blocked-access-date').resolves(scoBlockedAccessDates);

      // when
      const result = await route.model();

      // then
      assert.strictEqual(result.certificationVersion, certificationVersion);
      assert.strictEqual(result.scoBlockedAccessDates, scoBlockedAccessDates);
    });
  });
});
