import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapter | Module | Passage', function (hooks) {
  setupTest(hooks);

  module('#createRecord', function () {
    test('should trigger an ajax call with the right url and method', async function (assert) {
      // given
      const moduleId = Symbol('moduleId');
      const sequenceNumber = 1;
      const occurredAt = Symbol('timestamp');
      const moduleVersion = Symbol('moduleVersion');
      const adapterOptions = {
        moduleId,
        moduleVersion,
        occurredAt,
        sequenceNumber,
      };
      const snapshot = {
        adapterOptions,
        serialize: function () {
          return {
            data: {
              attributes: {
                'module-id': moduleId,
              },
              type: 'passages',
            },
          };
        },
      };

      const store = this.owner.lookup('service:store');
      const adapter = this.owner.lookup('adapter:passage');
      const type = { modelName: 'passage' };
      sinon.stub(adapter, 'ajax').resolves();
      const expectedUrl = `http://localhost:3000/api/passages`;

      // when
      await adapter.createRecord(store, type, snapshot);

      // then
      const expectedPayload = {
        data: {
          data: {
            attributes: {
              'module-id': moduleId,
              'module-version': moduleVersion,
              'sequence-number': sequenceNumber,
              'occurred-at': occurredAt,
            },
            type: 'passages',
          },
        },
      };

      sinon.assert.calledWith(adapter.ajax, expectedUrl, 'POST', expectedPayload);
      assert.ok(true);
    });
  });

  module('#terminate', function () {
    test('should trigger an ajax call with the right url and method', async function (assert) {
      // given
      const store = this.owner.lookup('service:store');
      const passage = store.createRecord('passage', { id: '123' });
      const adapter = this.owner.lookup('adapter:passage');
      sinon.stub(adapter, 'ajax').resolves();
      const expectedUrl = `http://localhost:3000/api/passages/${passage.id}/terminate`;

      // when
      await adapter.terminate({ passageId: passage.id });

      // then
      sinon.assert.calledWith(adapter.ajax, expectedUrl, 'POST');
      assert.ok(true);
    });
  });
});
