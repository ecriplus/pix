import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Controller | authenticated/sessions/new', function (hooks) {
  setupTest(hooks);

  test('it should have the correct pageTitle', function (assert) {
    // given
    const controller = this.owner.lookup('controller:authenticated/sessions/new');
    controller.intl = { t: sinon.stub().returns('Planification d’une session') };

    // when
    const pageTitle = controller.pageTitle;

    // then
    assert.strictEqual(pageTitle, 'Planification d’une session');
  });
});
