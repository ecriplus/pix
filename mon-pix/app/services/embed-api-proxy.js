import { registerDestructor } from '@ember/destroyable';
import { getOwner } from '@ember/owner';
import Service from '@ember/service';

export default class EmbedApiProxyService extends Service {
  forward(context, requestsPort, urlPrefix) {
    requestsPort.addEventListener('message', (event) => this.handleMessageEvent(event, { urlPrefix }));

    requestsPort.start();

    registerDestructor(context, () => {
      requestsPort.close();
    });
  }

  async handleMessageEvent(event, { fetch = window.fetch, urlPrefix }) {
    let { url } = event.data;
    if (url.startsWith('/')) url = url.slice(1);
    url = urlPrefix + url;

    const { init } = event.data;

    const [responsePort] = event.ports;

    try {
      const response = await fetch(url, {
        ...init,
        headers: {
          ...init.headers,
          ...this.headers,
        },
      });

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
      responsePort.postMessage({
        error: error.message,
      });
    }
  }

  /**
   * @param {string} url
   * @param {string} urlPrefix
   */
  buildURL(url, urlPrefix) {
    url = url.trim();
    if (/^https?:\/\//.test(url)) throw new Error('invalid URL');

    url = urlPrefix + trimLeadingSlashes(url);

    const { pathname: urlPath } = new URL(url, window.location);
    const { pathname: urlPrefixPath } = new URL(urlPrefix, window.location);
    if (!urlPath.startsWith(urlPrefixPath)) throw new Error('invalid URL');

    return url;
  }

  get headers() {
    return getOwner(this).lookup('adapter:application').headers;
  }
}

function trimLeadingSlashes(path) {
  while (path.startsWith('/')) {
    path = path.slice(1);
  }
  return path;
}
