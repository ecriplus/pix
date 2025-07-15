import { destroy, registerDestructor } from '@ember/destroyable';
import EmberObject from '@ember/object';
import { setupTest } from 'ember-qunit';
import ApplicationAdapter from 'mon-pix/adapters/application';
import PassageAdapter from 'mon-pix/adapters/passage';
import EmbedApiProxyService from 'mon-pix/services/embed-api-proxy';
import { module, test } from 'qunit';
import sinon from 'sinon';

module('Unit | Services | embed api proxy', function (hooks) {
  setupTest(hooks);

  let embedApiProxy;
  let urlForFindRecordStub;
  let urlForFindAllStub;

  hooks.beforeEach(function () {
    urlForFindRecordStub = sinon.stub().returns('/api/passages/123');
    this.owner.register(
      'adapter:passage',
      class extends PassageAdapter {
        get headers() {
          return {
            Authorization: 'Bearer oursier 🐻',
          };
        }
        urlForFindRecord = urlForFindRecordStub;
      },
    );

    urlForFindAllStub = sinon.stub().returns('/api');
    this.owner.register(
      'adapter:application',
      class extends ApplicationAdapter {
        get headers() {
          return {
            Authorization: 'Bearer cpasgrave',
          };
        }
        urlForFindAll = urlForFindAllStub;
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
      embedApiProxy.forward({}, requestsPort, '123', 'passage');

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
      embedApiProxy.forward(context, requestsPort, '123', 'passage');
      destroy(context);
      await contextDestroyed;

      // then
      sinon.assert.calledOnceWithExactly(requestsPort.close);
      assert.ok(true);
    });
  });

  module('#forwardForPreview', function () {
    test('it should add event listener and start port', function (assert) {
      // given
      const requestsPort = {
        start: sinon.stub(),
        close: sinon.stub(),
        addEventListener: sinon.stub(),
      };

      // when
      embedApiProxy.forwardForPreview({}, requestsPort, '123', 'passage');

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
      embedApiProxy.forwardForPreview(context, requestsPort, '123', 'passage');
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
        modelName: 'passage',
        id: '123',
      });

      // then
      sinon.assert.calledOnceWithExactly(urlForFindRecordStub, '123', 'passage');

      sinon.assert.calledWith(fetchStub, '/api/passages/123/embed/test', {
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

    module('when in preview', function () {
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
          preview: true,
        });

        // then
        sinon.assert.calledOnceWithExactly(urlForFindAllStub);

        sinon.assert.calledWith(fetchStub, '/api/llm/preview/embed/test', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer cpasgrave',
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
          modelName: 'passage',
          id: '123',
        });

        // then
        sinon.assert.calledOnceWithExactly(urlForFindRecordStub, '123', 'passage');

        sinon.assert.calledWith(fetchStub, '/api/passages/123/embed/test', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer oursier 🐻',
          },
        });

        sinon.assert.calledWith(postMessageStub, {
          error: 'connection reset by pear 🍐',
        });
        assert.ok(true);
      });
    });

    module('when postMessage throws a DataCloneError', function () {
      test('it should postMessage the response as an ArrayBuffer', async function (assert) {
        // given
        class DataCloneError extends Error {
          name = 'DataCloneError';
        }
        const postMessageStub = sinon.stub().onFirstCall().throws(new DataCloneError());
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
        const arrayBuffer = Symbol('arrayBuffer');
        class MockResponse extends Response {
          async arrayBuffer() {
            return arrayBuffer;
          }
        }
        const response = new MockResponse('mon body', {
          headers: new Headers(headers),
          status: 200,
        });
        const fetchStub = sinon.stub().resolves(response);

        // when
        await embedApiProxy.handleMessageEvent(event, {
          fetch: fetchStub,
          modelName: 'passage',
          id: '123',
        });

        // then
        sinon.assert.calledOnceWithExactly(urlForFindRecordStub, '123', 'passage');

        sinon.assert.calledWith(fetchStub, '/api/passages/123/embed/test', {
          method: 'POST',
          headers: {
            Authorization: 'Bearer oursier 🐻',
            'content-type': 'application/json',
          },
          body: '{ "prompt": "salut!" }',
        });

        sinon.assert.calledWith(
          postMessageStub.firstCall,
          {
            body: response.body,
            init: {
              headers,
              status: response.status,
            },
          },
          [response.body],
        );
        sinon.assert.calledWith(postMessageStub.secondCall, {
          body: arrayBuffer,
          init: {
            headers,
            status: response.status,
          },
        });
        assert.ok(true);
      });
    });
  });

  module('#buildURL', function () {
    test('it should prefix URL with prefix', function (assert) {
      // given
      const url = 'chat/456';
      const urlPrefix = '/api/passages/123/embed/';

      // when
      const actualURL = EmbedApiProxyService.buildURL(url, urlPrefix);

      // then
      assert.strictEqual(actualURL, '/api/passages/123/embed/chat/456');
    });

    module('when URL has leading slashes', function () {
      test('it should trim leading slashes', function (assert) {
        // given
        const url = '///chat/456';
        const urlPrefix = '/api/passages/123/embed/';

        // when
        const actualURL = EmbedApiProxyService.buildURL(url, urlPrefix);

        // then
        assert.strictEqual(actualURL, '/api/passages/123/embed/chat/456');
      });
    });

    module('when URL prefix includes host', function () {
      test('it should keep host', function (assert) {
        // given
        const url = 'chat/456';
        const urlPrefix = 'https://api.example.com/api/passages/123/embed/';

        // when
        const actualURL = EmbedApiProxyService.buildURL(url, urlPrefix);

        // then
        assert.strictEqual(actualURL, 'https://api.example.com/api/passages/123/embed/chat/456');
      });
    });

    module('when URL goes out of prefix', function () {
      test('it should throw an error', function (assert) {
        // given
        const url = '../chat/456';
        const urlPrefix = '/api/passages/123/embed/';

        // when
        const call = () => EmbedApiProxyService.buildURL(url, urlPrefix);

        // then
        assert.throws(call, new Error('invalid URL'));
      });
    });

    module('when URL includes host', function () {
      test('it should throw an error', function (assert) {
        // given
        const url = 'https://example.com/should/not/work';
        const urlPrefix = '/api/passages/123/embed/';

        // when
        const call = () => EmbedApiProxyService.buildURL(url, urlPrefix);

        // then
        assert.throws(call, new Error('invalid URL'));
      });
    });
  });
});
