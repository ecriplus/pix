import { setupTest } from 'ember-qunit';
import ENV from 'pix-admin/config/environment';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Adapters | certification-version', function (hooks) {
  setupTest(hooks);

  module('#queryRecord', () => {
    test('should call certification-versions CORE active endpoint', async function (assert) {
      const adapter = this.owner.lookup('adapter:certification-version');
      const certificationVersionResponse = {
        data: {
          id: '123',
          type: 'certification-versions',
          attributes: {
            scope: 'CORE',
            'start-date': '2024-01-01',
            'expiration-date': null,
            'assessment-duration': 120,
            'challenges-configuration': {
              maximumAssessmentLength: 32,
              challengesBetweenSameCompetence: 2,
              variationPercent: 0.5,
              limitToOneQuestionPerTube: true,
              enablePassageByAllCompetences: false,
            },
          },
        },
      };
      sinon.stub(adapter, 'ajax').resolves(certificationVersionResponse);

      const result = await adapter.queryRecord(null, null, { scope: 'CORE' });

      const expectedUrl = `${ENV.APP.API_HOST}/api/admin/certification-versions/CORE/active`;
      sinon.assert.calledWith(adapter.ajax, expectedUrl, 'GET');
      assert.deepEqual(result, certificationVersionResponse);
    });

    test('should default to CORE scope if not provided', async function (assert) {
      const adapter = this.owner.lookup('adapter:certification-version');
      sinon.stub(adapter, 'ajax').resolves({});

      await adapter.queryRecord(null, null, {});

      const expectedUrl = `${ENV.APP.API_HOST}/api/admin/certification-versions/CORE/active`;
      sinon.assert.calledWith(adapter.ajax, expectedUrl, 'GET');
      assert.ok(adapter);
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
