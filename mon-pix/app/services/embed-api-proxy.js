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

  get headers() {
    return getOwner(this).lookup('adapter:application').headers;
  }
}
