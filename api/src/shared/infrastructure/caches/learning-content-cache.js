import * as learningContentPubSub from '../caches/learning-content-pubsub.js';
import { child, SCOPES } from '../utils/logger.js';

const logger = child('learningcontent:cache', { event: SCOPES.LEARNING_CONTENT });

export class LearningContentCache {
  #map;
  #pubSub;
  #name;

  /**
   * @param {{
   *   name: string
   *   pubSub: import('../caches/learning-content-pubsub.js').LearningContentPubSub
   *   map: Map
   * }} config
   * @returns
   */
  constructor({ name, pubSub = learningContentPubSub.getPubSub(), map = new Map() }) {
    this.#name = name;
    this.#pubSub = pubSub;
    this.#map = map;

    this.#subscribe();
  }

  get(key) {
    return this.#map.get(key);
  }

  set(key, value) {
    return this.#map.set(key, value);
  }

  delete(key) {
    return this.#pubSub.publish(this.#name, { type: 'delete', key });
  }

  clear() {
    return this.#pubSub.publish(this.#name, { type: 'clear' });
  }

  async #subscribe() {
    try {
      for await (const message of this.#pubSub.subscribe(this.#name)) {
        if (message.type === 'clear') {
          logger.debug({ cacheName: this.#name }, 'clearing cache');
          this.#map.clear();
        }
        if (message.type === 'delete') {
          logger.debug({ cacheName: this.#name, key: message.key }, 'deleting cache key');
          this.#map.delete(message.key);
        }
      }
    } catch (err) {
      logger.err(
        { cacheName: this.#name, err },
        'Error when subscribing to events for managing Learning Content Cache',
      );
      throw err;
    }
  }
}

export const learningContentCache = {
  async quit() {
    return learningContentPubSub.quit();
  },
};
