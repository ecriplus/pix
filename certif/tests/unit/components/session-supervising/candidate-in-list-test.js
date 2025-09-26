import Service from '@ember/service';
import { t } from 'ember-intl/test-support';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

import createGlimmerComponent from '../../../helpers/create-glimmer-component';

module('Unit | Component | session-supervising/candidate-in-list', function (hooks) {
  setupTest(hooks);

  module('validateLiveAlert', function () {
    module('when there is no error', function () {
      test('it should call the method with the correct arguments', async function (assert) {
        // given
        const subcategory = 'EMBED_NOT_WORKING';
        const component = createGlimmerComponent('component:session-supervising/candidate-in-list');
        component.args.sessionId = 123;
        component.args.candidate = { userId: 456 };
        component.pixToast = { sendErrorNotification: sinon.spy() };
        const store = this.owner.lookup('service:store');
        const adapter = store.adapterFor('session-management');
        adapter.validateLiveAlert = sinon.stub();
        adapter.validateLiveAlert.resolves();

        class IntlStub extends Service {
          t = sinon.stub();
        }

        this.owner.register('service:intl', IntlStub);

        // when
        await component.validateLiveAlert(subcategory);

        // then
        sinon.assert.calledWithExactly(adapter.validateLiveAlert, { sessionId: 123, candidateId: 456, subcategory });
        sinon.assert.notCalled(component.pixToast.sendErrorNotification);
        assert.ok(true);
      });
    });

    module('when there is an error', function (hooks) {
      let adapter, component;

      hooks.beforeEach(function () {
        // given
        class IntlStub extends Service {
          t = sinon.stub();
        }

        this.owner.register('service:intl', IntlStub);

        component = createGlimmerComponent('component:session-supervising/candidate-in-list');
        component.args.sessionId = 123;
        component.args.candidate = { userId: 456 };
        component.pixToast = { sendErrorNotification: sinon.spy() };
        const store = this.owner.lookup('service:store');
        adapter = store.adapterFor('session-management');
        adapter.validateLiveAlert = sinon.stub();
      });

      test('it should call the notification service', async function (assert) {
        // given
        adapter.validateLiveAlert.rejects({ errors: [{}] });

        // when
        await component.validateLiveAlert('EMBED_NOT_WORKING');

        // then
        sinon.assert.calledOnceWithExactly(component.pixToast.sendErrorNotification, {
          message: t(
            'pages.session-supervising.candidate-in-list.handle-live-alert-modal.error-handling.miscellaneous',
          ),
        });
        assert.ok(true);
      });

      module('when there is a ALREADY_ANSWERED_ERROR error', function () {
        test('it should call the notification service with the request error message', async function (assert) {
          // given
          adapter.validateLiveAlert.rejects({ errors: [{ code: 'ALREADY_ANSWERED_ERROR', detail: 'error message' }] });

          // when
          await component.validateLiveAlert('EMBED_NOT_WORKING');

          // then
          sinon.assert.calledOnceWithExactly(component.pixToast.sendErrorNotification, {
            message: t(
              'pages.session-supervising.candidate-in-list.handle-live-alert-modal.error-handling.challenge-already-answered',
            ),
          });
          assert.ok(true);
        });
      });
    });
  });

  module('rejectLiveAlert', function () {
    module('when there is no error', function () {
      test('it should call the method with the correct arguments', async function (assert) {
        // given
        const component = createGlimmerComponent('component:session-supervising/candidate-in-list');
        component.args.sessionId = 123;
        component.args.candidate = { userId: 456 };
        component.pixToast = { sendErrorNotification: sinon.spy() };
        const store = this.owner.lookup('service:store');
        const adapter = store.adapterFor('session-management');
        adapter.dismissLiveAlert = sinon.stub();
        adapter.dismissLiveAlert.resolves();

        class IntlStub extends Service {
          t = sinon.stub();
        }

        this.owner.register('service:intl', IntlStub);

        // when
        await component.rejectLiveAlert();

        // then
        sinon.assert.calledWithExactly(adapter.dismissLiveAlert, 123, 456);
        sinon.assert.notCalled(component.pixToast.sendErrorNotification);
        assert.ok(true);
      });
    });

    module('when there is an error', function () {
      test('it should call the notification service', async function (assert) {
        // given
        const component = createGlimmerComponent('component:session-supervising/candidate-in-list');
        component.args.sessionId = 123;
        component.args.candidate = { userId: 456 };
        component.pixToast = { sendErrorNotification: sinon.spy() };
        const store = this.owner.lookup('service:store');
        const adapter = store.adapterFor('session-management');
        adapter.dismissLiveAlert = sinon.stub();
        adapter.dismissLiveAlert.rejects();

        class IntlStub extends Service {
          t = sinon.stub();
        }

        this.owner.register('service:intl', IntlStub);

        // when
        await component.rejectLiveAlert();

        // then
        sinon.assert.calledOnce(component.pixToast.sendErrorNotification);
        assert.ok(true);
      });
    });
  });

  module('formattedBirthdate', function () {
    test('it should format birthdate from YYYY-MM-DD to DD/MM/YYYY', function (assert) {
      // given
      const component = createGlimmerComponent('component:session-supervising/candidate-in-list');
      component.args.candidate = { birthdate: '1984-05-28' };

      // when
      const result = component.formattedBirthdate;

      // then
      assert.strictEqual(result, '28/05/1984');
    });

    test('it should return empty string when birthdate is null', function (assert) {
      // given
      const component = createGlimmerComponent('component:session-supervising/candidate-in-list');
      component.args.candidate = { birthdate: null };

      // when
      const result = component.formattedBirthdate;

      // then
      assert.strictEqual(result, '');
    });

    test('it should return empty string when birthdate is undefined', function (assert) {
      // given
      const component = createGlimmerComponent('component:session-supervising/candidate-in-list');
      component.args.candidate = { birthdate: undefined };

      // when
      const result = component.formattedBirthdate;

      // then
      assert.strictEqual(result, '');
    });

    test('it should return empty string when birthdate is empty string', function (assert) {
      // given
      const component = createGlimmerComponent('component:session-supervising/candidate-in-list');
      component.args.candidate = { birthdate: '' };

      // when
      const result = component.formattedBirthdate;

      // then
      assert.strictEqual(result, '');
    });
  });
});
