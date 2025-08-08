import Service from '@ember/service';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | application', function (hooks) {
  setupTest(hooks);

  hooks.beforeEach(function () {
    const domainService = this.owner.lookup('service:currentDomain');
    sinon.stub(domainService, 'getExtension').returns('fr');

    class CurrentUserStub extends Service {
      load = sinon.stub();
      prescriber = {
        id: '123',
        language: 'fr',
      };
    }
    this.owner.register('service:currentUser', CurrentUserStub);
    this.currentUser = this.owner.lookup('service:currentUser');

    class SessionStub extends Service {
      setup = sinon.stub().resolves();
      loadCurrentUserAndSetLocale = sinon.stub().resolves();
    }
    this.owner.register('service:session', SessionStub);
    this.session = this.owner.lookup('service:session');

    class FeatureTogglesStub extends Service {
      load = sinon.stub().resolves();
    }
    this.owner.register('service:featureToggles', FeatureTogglesStub);
    this.featureToggles = this.owner.lookup('service:featureToggles');

    this.route = this.owner.lookup('route:application');
  });

  module('beforeModel', function () {
    test('loads feature toggles', async function (assert) {
      // given
      const transition = { to: { queryParams: {} } };

      // when
      await this.route.beforeModel(transition);

      // then
      assert.ok(this.featureToggles.load.called);
    });

    test('calls loadCurrentUserAndSetLocale', async function (assert) {
      // given
      const transition = { to: { queryParams: { lang: 'fr' } } };
      const route = this.owner.lookup('route:application');

      // when
      await route.beforeModel(transition);

      // then
      sinon.assert.calledOnceWithExactly(route.session.loadCurrentUserAndSetLocale, transition);
      assert.ok(true);
    });
  });
});
