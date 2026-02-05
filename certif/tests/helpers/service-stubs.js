import Service from '@ember/service';

/**
 * @param {Object} owner - The owner object.
 * @returns {Service} The stubbed featureToggles service.
 */
export function stubFeatureTogglesService(owner, featureToggles) {
  class FeatureTogglesServiceServiceStub extends Service {
    #featureToggles;

    constructor() {
      super();
      this.#featureToggles = featureToggles ?? {};
    }

    load() {
      return Promise.resolve();
    }

    get featureToggles() {
      return this.#featureToggles;
    }
  }

  owner.unregister('service:featureToggles');
  owner.register('service:featureToggles', FeatureTogglesServiceServiceStub);
  return owner.lookup('service:featureToggles');
}
