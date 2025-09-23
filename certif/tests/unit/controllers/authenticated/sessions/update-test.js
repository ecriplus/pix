import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Controller | authenticated/sessions/update', function (hooks) {
  setupTest(hooks);

  module('#pageTitle', function () {
    test('it should return the correct page title', function (assert) {
      // given
      const controller = this.owner.lookup('controller:authenticated/sessions/update');
      const sessionId = 'sessionId';
      const session = { id: sessionId };
      controller.model = session;
      controller.intl = { t: sinon.stub().returns('Modifier la session') };

      // when
      const pageTitle = controller.pageTitle;

      // then
      assert.strictEqual(pageTitle, 'Modifier la session | Session sessionId | Pix Certif');
    });
  });
});
