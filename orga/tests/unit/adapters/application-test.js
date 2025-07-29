import REST from '@ember-data/adapter/rest';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

const FRENCH_FRANCE_LOCALE = 'fr-fr';

module('Unit | Adapters | ApplicationAdapter', function (hooks) {
  setupTest(hooks);

  test('should specify /api as the root url', function (assert) {
    // Given
    const applicationAdapter = this.owner.lookup('adapter:application');

    // Then
    assert.strictEqual(applicationAdapter.namespace, 'api');
  });

  module('get headers()', function () {
    test('should add header with authentication token when the session is authenticated', function (assert) {
      // Given
      const access_token = '23456789';
      const applicationAdapter = this.owner.lookup('adapter:application');

      // When
      applicationAdapter.set('session', { isAuthenticated: true, data: { authenticated: { access_token } } });

      // Then
      assert.strictEqual(applicationAdapter.headers['Authorization'], `Bearer ${access_token}`);
    });

    test('should not add header authentication token when the session is not authenticated', function (assert) {
      // Given
      const applicationAdapter = this.owner.lookup('adapter:application');

      // When
      applicationAdapter.set('session', {});

      // Then
      assert.notOk(applicationAdapter.headers['Authorization']);
    });

    test('should add Accept-Language header from the locale service', function (assert) {
      // Given // When
      const applicationAdapter = this.owner.lookup('adapter:application');
      applicationAdapter.locale = { acceptLanguageHeader: FRENCH_FRANCE_LOCALE };

      // Then
      assert.strictEqual(applicationAdapter.headers['Accept-Language'], FRENCH_FRANCE_LOCALE);
    });
  });

  module('ajax()', function () {
    test('should queue ajax calls', function (assert) {
      // Given
      const applicationAdapter = this.owner.lookup('adapter:application');
      applicationAdapter.ajaxQueue = { add: sinon.stub().resolves() };

      // When
      applicationAdapter.findRecord(null, { modelName: 'user' }, 1);

      // Then
      sinon.assert.calledOnce(applicationAdapter.ajaxQueue.add);
      assert.ok(applicationAdapter);
    });
  });

  module('#handleResponse', function () {
    test('should log identified API error', function (assert) {
      // Given
      const consoleTable = sinon.stub(console, 'table');

      const applicationAdapter = this.owner.lookup('adapter:application');
      sinon.stub(REST.prototype, 'handleResponse');

      const myApiError = { id: 1, title: 'title' };

      // When
      applicationAdapter.handleResponse(null, null, { errors: [myApiError] });

      // Then
      sinon.assert.calledOnceWithExactly(consoleTable, myApiError);
      assert.ok(true);
    });
  });
});
