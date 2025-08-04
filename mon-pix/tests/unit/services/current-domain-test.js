import { setupTest } from 'ember-qunit';
import PixWindow from 'mon-pix/utils/pix-window';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Service | currentDomain', function (hooks) {
  setupTest(hooks);

  hooks.afterEach(function () {
    sinon.restore();
  });

  module('#getExtension', function () {
    module('when location is FR TLD', function () {
      test(`returns fr`, function (assert) {
        // given
        _stubWindowUrl(this.owner, 'https://pix.fr/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const extension = service.getExtension();

        // then
        assert.strictEqual(extension, 'fr');
      });
    });

    module('when location is ORG TLD', function () {
      test(`returns org`, function (assert) {
        // given
        _stubWindowUrl(this.owner, 'https://pix.org/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const extension = service.getExtension();

        // then
        assert.strictEqual(extension, 'org');
      });
    });
  });

  module('#isFranceDomain', function () {
    module('when location is FR TLD', function () {
      test('returns true', function (assert) {
        // given
        _stubWindowUrl(this.owner, 'https://pix.fr/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const isFranceDomain = service.isFranceDomain;

        // then
        assert.true(isFranceDomain);
      });
    });

    module('when location is ORG TLD', function () {
      test('returns false', function (assert) {
        // given
        _stubWindowUrl(this.owner, 'https://pix.org/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const isFranceDomain = service.isFranceDomain;

        // then
        assert.false(isFranceDomain);
      });
    });
  });

  module('#domain', function () {
    module('when location is localhost', function () {
      test('returns locahost as domain', function (assert) {
        // given
        _stubWindowUrl(this.owner, 'http://localhost:4200/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const domain = service.domain;

        // then
        assert.strictEqual(domain, 'localhost');
      });
    });

    module('when location is not localhost', function () {
      test('returns the last 2-parts segment', function (assert) {
        // given
        _stubWindowUrl(this.owner, 'https://pix.fr/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const domain = service.domain;

        // then
        assert.strictEqual(domain, 'pix.fr');
      });
    });
  });

  module('#isLocalhost', function () {
    module('when location is localhost', function () {
      test('returns true', function (assert) {
        // given
        _stubWindowUrl(this.owner, 'http://localhost:4200/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const isLocalhost = service.isLocalhost;

        // then
        assert.true(isLocalhost);
      });
    });

    module('when location is not localhost', function () {
      test('returns false', function (assert) {
        // given
        _stubWindowUrl(this.owner, 'https://pix.fr/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const isLocalhost = service.isLocalhost;

        // then
        assert.false(isLocalhost);
      });
    });
  });

  module('#convertUrlToOrgDomain', function () {
    module('when location is localhost', function () {
      test('returns the original URL', function (assert) {
        // given
        _stubWindowUrl(this.owner, 'http://localhost:4200/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const url = service.convertUrlToOrgDomain();

        // then
        assert.strictEqual(url, 'http://localhost:4200/foo?bar=baz');
      });
    });

    module('when location is FR TLD', function () {
      test('returns the URL with ORG TLD', function (assert) {
        // given
        _stubWindowUrl(this.owner, 'https://app.pix.fr/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const url = service.convertUrlToOrgDomain();

        // then
        assert.strictEqual(url, 'https://app.pix.org/foo?bar=baz');
      });
    });

    module('when location is ORG TLD', function () {
      test('returns the original URL', function (assert) {
        // given
        _stubWindowUrl(this.owner, 'https://app.pix.org/foo?bar=baz');
        const service = this.owner.lookup('service:currentDomain');

        // when
        const url = service.convertUrlToOrgDomain();

        // then
        assert.strictEqual(url, 'https://app.pix.org/foo?bar=baz');
      });
    });
  });
});

function _stubWindowUrl(owner, url) {
  const newUrl = new URL(url);
  sinon.stub(PixWindow, 'getLocationHash').returns(newUrl.hash);
  sinon.stub(PixWindow, 'getLocationHost').returns(newUrl.host);
  sinon.stub(PixWindow, 'getLocationHostname').returns(newUrl.hostname);
  sinon.stub(PixWindow, 'getLocationHref').returns(newUrl.href);
  sinon.stub(PixWindow, 'reload');
  sinon.stub(PixWindow, 'replace');

  const locationService = owner.lookup('service:location');
  sinon.stub(locationService, 'href').value(url);
}
