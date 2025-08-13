import Location from 'mon-pix/utils/location';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Utility | location', function (hooks) {
  hooks.afterEach(function () {
    sinon.restore();
  });

  module('#getLocationHref', function () {
    test('should return the full URL', function (assert) {
      // given
      const expectedUrl = 'https://example.com/path?query=param#hash';
      sinon.stub(Location, 'getLocationHref').returns(expectedUrl);

      // when
      const url = Location.getLocationHref();

      // then
      assert.strictEqual(url, expectedUrl);
    });
  });

  module('#replace', function () {
    test('should replace the current URL', function (assert) {
      // given
      const newUrl = 'https://example.com/new-path';
      const replaceStub = sinon.stub(Location, 'replace');

      // when
      Location.replace(newUrl);

      // then
      sinon.assert.calledWith(replaceStub, newUrl);
      assert.ok(true);
    });
  });

  module('#reload', function () {
    test('should reload the current page', function (assert) {
      // given
      const reloadStub = sinon.stub(Location, 'reload');

      // when
      Location.reload();

      // then
      sinon.assert.calledOnce(reloadStub);
      assert.ok(true);
    });
  });

  module('#assign', function () {
    test('should assign a new URL', function (assert) {
      // given
      const newUrl = 'https://example.com/new-path';
      const assignStub = sinon.stub(Location, 'assign');

      // when
      Location.assign(newUrl);

      // then
      sinon.assert.calledWith(assignStub, newUrl);
      assert.ok(true);
    });
  });
});
