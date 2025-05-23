import { destroy, registerDestructor } from '@ember/destroyable';
import EmberObject from '@ember/object';
import Adapter from '@ember-data/adapter';
import { setupTest } from 'ember-qunit';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Services | embed api proxy', function (hooks) {
  setupTest(hooks);

  let embedApiProxy;

  hooks.beforeEach(function () {
    this.owner.register(
      'adapter:application',
      class ApplicationAdapter extends Adapter {
        get headers() {
          return {
            Authorization: 'Bearer oursier 🐻',
          };
        }
      },
    );

    embedApiProxy = this.owner.lookup('service:embed-api-proxy');
  });

  module('#forward', function () {
    test('it should add event listener and start port', function (assert) {
      // given
      const requestsPort = {
        start: sinon.stub(),
        close: sinon.stub(),
        addEventListener: sinon.stub(),
      };

      // when
      embedApiProxy.forward({}, requestsPort, '/api');

      // then
      sinon.assert.calledWith(requestsPort.addEventListener, 'message', sinon.match.func);
      sinon.assert.calledOnce(requestsPort.start);
      assert.ok(true);
    });

    test('it closes the port when the context is destroyed', async function (assert) {
      // given
      const requestsPort = {
        addEventListener: sinon.stub(),
        start: sinon.stub(),
        close: sinon.stub(),
      };
      const context = EmberObject.create();
      const contextDestroyed = new Promise((resolve) => {
        registerDestructor(context, () => resolve());
      });

      // when
      embedApiProxy.forward(context, requestsPort, '/api/');
      destroy(context);
      await contextDestroyed;

      // then
      sinon.assert.calledOnceWithExactly(requestsPort.close);
      assert.ok(true);
    });
  });

  module('#handleMessageEvent', function () {
    test('it should proxy request and postMessage the response', async function (assert) {
      // given
      const postMessageStub = sinon.stub();
      const request = {
        url: '/test',
        init: {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: '{ "prompt": "salut!" }',
        },
      };
      const event = {
        data: request,
        ports: [{ postMessage: postMessageStub }],
      };
      const headers = {
        'content-type': 'text/event-stream',
      };
      const response = new Response('mon body', {
        headers: new Headers(headers),
        status: 200,
      });
      const fetchStub = sinon.stub().resolves(response);

      // when
      await embedApiProxy.handleMessageEvent(event, {
        fetch: fetchStub,
        urlPrefix: '/api/',
      });

      // then
      sinon.assert.calledWith(fetchStub, '/api/test', {
        method: 'POST',
        headers: {
          Authorization: 'Bearer oursier 🐻',
          'content-type': 'application/json',
        },
        body: '{ "prompt": "salut!" }',
      });

      sinon.assert.calledWith(
        postMessageStub,
        {
          body: response.body,
          init: {
            headers,
            status: response.status,
          },
        },
        [response.body],
      );
      assert.ok(true);
    });

    module('when fetch throws an error', function () {
      test('it should postMessage the error', async function (assert) {
        // given
        const postMessageStub = sinon.stub();
        const request = {
          url: '/test',
          init: {
            method: 'POST',
          },
        };
        const event = {
          data: request,
          ports: [{ postMessage: postMessageStub }],
        };
        const fetchStub = sinon.stub().rejects(new Error('connection reset by pear 🍐'));

        // when
        await embedApiProxy.handleMessageEvent(event, {
          fetch: fetchStub,
          urlPrefix: '/api/',
        });

        // then
        sinon.assert.calledWith(postMessageStub, {
          error: 'connection reset by pear 🍐',
        });
        assert.ok(true);
      });
    });
  });
});
