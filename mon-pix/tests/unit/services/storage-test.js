import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';

module('Unit | Service | storage', function (hooks) {
  setupTest(hooks);

  test('setLogin', function (assert) {
    // given
    const service = this.owner.lookup('service:storage');
    const login = 'someone@example.net';

    // when
    service.setLogin(login);

    // then
    assert.strictEqual(sessionStorage.getItem('PIX_LOGIN'), login);
  });

  test('getLogin', function (assert) {
    // given
    const service = this.owner.lookup('service:storage');
    const login = 'someone@example.net';
    sessionStorage.setItem('PIX_LOGIN', login);

    // when
    const result = service.getLogin();

    // then
    assert.strictEqual(result, login);
  });

  test('getLogin with no login', function (assert) {
    // given
    const service = this.owner.lookup('service:storage');
    sessionStorage.clear();

    // when
    const result = service.getLogin();

    // then
    assert.strictEqual(result, null);
  });
});
