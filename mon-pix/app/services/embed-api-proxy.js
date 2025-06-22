import { registerDestructor } from '@ember/destroyable';
import { getOwner } from '@ember/owner';
import Service from '@ember/service';

export default class EmbedApiProxyService extends Service {
  forward(context, requestsPort, id, modelName) {
    requestsPort.addEventListener('message', (event) => this.handleMessageEvent(event, { id, modelName }));

    requestsPort.start();

    registerDestructor(context, () => {
      requestsPort.close();
    });
  }

  async handleMessageEvent(event, { fetch = window.fetch, modelName, id }) {
    const adapter = getOwner(this).lookup(`adapter:${modelName}`);

    let { url } = event.data;

    const urlPrefix = `${adapter.urlForFindRecord(id, modelName)}/embed/`;
    url = EmbedApiProxyService.buildURL(url, urlPrefix);

    const { init } = event.data;

    const [responsePort] = event.ports;

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...init.headers,
          ...adapter.headers,
        },
      });

      try {
        responsePort.postMessage(
          {
            body: response.body,
            init: {
              headers: Object.fromEntries(response.headers),
              status: response.status,
            },
          },
          [response.body],
        );
      } catch (error) {
        // WORKAROUND: In Safari ReadableStream is not transferable
        if (error.name === 'DataCloneError') {
          responsePort.postMessage({
            body: await response.arrayBuffer(),
            init: {
              headers: Object.fromEntries(response.headers),
              status: response.status,
            },
          });
        } else {
          throw error;
        }
      }
    } catch (error) {
      responsePort.postMessage({
        error: error.message,
      });
    }
  }

  /**
   * @param {string} url
   * @param {string} urlPrefix
   */
  static buildURL(url, urlPrefix) {
    url = url.trim();
    if (/^https?:\/\//.test(url)) throw new Error('invalid URL');

    url = urlPrefix + trimLeadingSlashes(url);

    const { pathname: urlPath } = new URL(url, window.location);
    const { pathname: urlPrefixPath } = new URL(urlPrefix, window.location);
    if (!urlPath.startsWith(urlPrefixPath)) throw new Error('invalid URL');

    return url;
  }
}

function trimLeadingSlashes(path) {
  while (path.startsWith('/')) {
    path = path.slice(1);
  }
  return path;
}
