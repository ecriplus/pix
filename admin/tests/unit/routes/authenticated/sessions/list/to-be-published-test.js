import Service from '@ember/service';
import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated/sessions/list/to-be-published', function(hooks) {
  setupTest(hooks);

  let store;
  hooks.beforeEach(function() {
    class StoreStub extends Service {
      query = null;
    }
    this.owner.register('service:store', StoreStub);
    store = this.owner.lookup('service:store');
  });

  module('#model', function() {
    test('it should fetch the list of sessions to be published', async function(assert) {
      // given
      const route = this.owner.lookup('route:authenticated/sessions/list/to-be-published');
      const publishableSessions = [{
        certificationCenterName: 'Centre SCO des Anne-Solo',
        finalizedAt: '2020-04-15T15:00:34.000Z',
      }];
      const queryStub = sinon.stub();
      queryStub.withArgs('publishable-session', {}).resolves(publishableSessions);
      store.query = queryStub;

      // when
      const result = await route.model();

      // then
      assert.equal(result, publishableSessions);
    });
  });
});
