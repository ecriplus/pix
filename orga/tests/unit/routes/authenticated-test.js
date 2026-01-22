import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Route | authenticated', function (hooks) {
  setupTest(hooks);

  let route;
  let sessionService;
  let routerService;
  let joinInvitationService;
  let currentUserService;
  let transition;

  hooks.beforeEach(function () {
    route = this.owner.lookup('route:authenticated');
    sessionService = this.owner.lookup('service:session');
    routerService = this.owner.lookup('service:router');
    joinInvitationService = this.owner.lookup('service:join-invitation');
    currentUserService = this.owner.lookup('service:current-user');
    transition = {
      isAborted: false,
      abort: sinon.stub(),
    };
  });

  module('beforeModel', function () {
    test('aborts transition if user not logged in', async function (assert) {
      // given
      const requireAuthenticationStub = sinon.stub(sessionService, 'requireAuthentication');
      const replaceWithStub = sinon.stub(routerService, 'replaceWith');

      // when
      route.beforeModel(transition);

      // then
      assert.ok(requireAuthenticationStub.calledWith(transition, 'authentication.login'));
      assert.notOk(replaceWithStub.called);
    });

    module('When user is not authorized', function () {
      test('invalidates user session', async function (assert) {
        // given
        sinon.stub(sessionService, 'requireAuthentication');
        sinon.stub(currentUserService, 'load').rejects({
          code: 'USER_HAS_NO_ORGANIZATION_MEMBERSHIP',
        });
        const invalidateStub = sinon.stub(sessionService, 'invalidateWithError');

        // when
        await route.beforeModel(transition);

        // then
        assert.ok(invalidateStub.calledWithExactly('USER_HAS_NO_ORGANIZATION_MEMBERSHIP'));
      });
    });

    module('When invitation is not valid', function () {
      test('invalidates user session', async function (assert) {
        // given
        sinon.stub(sessionService, 'requireAuthentication');
        sinon.stub(joinInvitationService, 'invitation').value({ invitationId: 1, code: '123' });
        sinon.stub(joinInvitationService, 'acceptInvitationByUserId').rejects({
          status: '409',
          code: 'INVITATION_ALREADY_ACCEPTED_OR_CANCELLED',
        });
        const invalidateStub = sinon.stub(sessionService, 'invalidateWithError');

        // when
        await route.beforeModel(transition);

        // then
        assert.ok(invalidateStub.calledWithExactly('INVITATION_ALREADY_ACCEPTED_OR_CANCELLED'));
      });
    });

    module('When CGU not accepted yet', function () {
      test('redirects towards cgu', async function (assert) {
        // given
        sinon.stub(sessionService, 'requireAuthentication');
        sinon.stub(currentUserService, 'load').resolves();
        sinon.stub(currentUserService, 'organization').value({ id: 123 });
        sinon
          .stub(currentUserService, 'prescriber')
          .value({ placesManagement: true, pixOrgaTermsOfServiceStatus: 'requested' });
        const replaceWithStub = sinon.stub(routerService, 'replaceWith');

        // when
        await route.beforeModel(transition);

        // then
        assert.ok(replaceWithStub.calledWithExactly('terms-of-service'));
      });
    });

    module('When CGU already accepted', function () {
      test('does not redirect towards cgu ', async function (assert) {
        // given
        sinon.stub(sessionService, 'requireAuthentication');
        sinon.stub(currentUserService, 'load').resolves();
        sinon.stub(currentUserService, 'organization').value({ id: 123 });
        sinon
          .stub(currentUserService, 'prescriber')
          .value({ placesManagement: true, pixOrgaTermsOfServiceStatus: 'accepted' });
        const replaceWithStub = sinon.stub(routerService, 'replaceWith');

        // when
        await route.beforeModel(transition);

        // then
        assert.notOk(replaceWithStub.calledWithExactly('terms-of-service'));
      });
    });
  });
});
