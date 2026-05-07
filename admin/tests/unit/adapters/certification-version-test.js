import { setupTest } from 'ember-qunit';
import ENV from 'pix-admin/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapters | certification-version', function (hooks) {
  setupTest(hooks);

  module('#findRecord', () => {
    test('should call certification-versions endpoint with the given id', async function (assert) {
      // given
      const adapter = this.owner.lookup('adapter:certification-version');
      const response = {
        data: {
          id: '42',
          type: 'certification-versions',
          attributes: {
            'start-date': '2024-01-01',
            'expiration-date': null,
            'assessment-duration': 105,
            'minimum-answers': 20,
            'maximum-assessment-length': 32,
          },
          relationships: {
            areas: { data: [] },
          },
        },
      };
      sinon.stub(adapter, 'ajax').resolves(response);

      // when
      const result = await adapter.findRecord(null, null, '42');

      // then
      const expectedUrl = `${ENV.APP.API_HOST}/api/admin/certification-versions/42`;
      sinon.assert.calledWith(adapter.ajax, expectedUrl, 'GET');
      assert.deepEqual(result, response);
    });
  });

  module('#updateRecord', () => {
    test('should call PATCH with certification version id and serialized data', async function (assert) {
      const adapter = this.owner.lookup('adapter:certification-version');
      const snapshot = {
        id: '456',
      };
      const serializedData = {
        data: {
          type: 'certification-versions',
          id: '456',
          attributes: {
            'challenges-configuration': {
              maximumAssessmentLength: 40,
            },
          },
        },
      };

      sinon.stub(adapter, 'serialize').returns(serializedData);
      sinon.stub(adapter, 'ajax').resolves({});

      await adapter.updateRecord(null, null, snapshot);

      const expectedUrl = `${ENV.APP.API_HOST}/api/admin/certification-versions/456`;
      sinon.assert.calledWith(adapter.ajax, expectedUrl, 'PATCH', { data: serializedData });
      assert.ok(adapter);
    });
  });
});
