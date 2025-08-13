import Joi from 'joi';

const ConfigSchema = Joi.object().pattern(
  Joi.string(),
  Joi.object({
    description: Joi.string().required(),
    type: Joi.string().valid('boolean', 'number', 'string').required(),
    defaultValue: Joi.any().required(),
    devDefaultValues: Joi.object({
      test: Joi.any().optional(),
      reviewApp: Joi.any().optional(),
    }).optional(),
    tags: Joi.array().items(Joi.string()),
  }),
);

export class FeatureToggleNotFoundError extends Error {
  constructor(key) {
    super(`Feature toggle with key "${key}" not found in the configuration`);
    this.name = 'FeatureToggleNotFoundError';
  }
}

/**
 * Class representing a feature toggles client.
 */
export class FeatureTogglesClient {
  /**
   * Create a feature toggles client.
   * @param {KeyValueStorage} storage - A KeyValueStorage instance.
   * @param {'test' | 'reviewApp'} [environment] - environment (test or reviewApp)
   */
  constructor(storage, environment) {
    this.storage = storage;
    this.environment = environment;
    this.config = {};
  }

  /**
   * Initialize client and storage with the given configuration
   * @param {Object} config - The configuration.
   * @returns {Promise<void>} A resolved promise
   */
  async init(config) {
    Joi.assert(config, ConfigSchema);
    this.config = config;

    const currentStoredKeys = await this.storage.keys('*');
    for (const key of currentStoredKeys) {
      if (!this.config[key]) {
        await this.storage.delete(key);
      }
    }

    for (const [key, featureToggle] of Object.entries(this.config)) {
      if (!currentStoredKeys.includes(key)) {
        const defaultValue = this.#getFeatureToggleDefaultValue(featureToggle);
        await this.storage.save({ key, value: defaultValue });
      }
    }

    await this.storage.save({ key: '_config', value: this.config });
  }

  /**
   * Get the value of a feature toggle.
   * @param {string} key - The key of the feature toggle.
   * @returns {Promise<any>} The value of the feature toggle.
   */
  async get(key) {
    const featureToggle = this.config[key];
    if (!featureToggle) {
      throw new FeatureToggleNotFoundError(key);
    }
    const value = await this.storage.get(key);
    return value ?? featureToggle.defaultValue;
  }

  /**
   * Set the value of a feature toggle.
   * @param {string} key - The key of the feature toggle.
   * @param {any} value - The value to set.
   */
  async set(key, value) {
    const featureToggle = this.config[key];
    if (!featureToggle) {
      throw new FeatureToggleNotFoundError(key);
    }
    await this.storage.save({ key, value });
  }

  /**
   * Get all feature toggles.
   * @returns {Promise<Object>} An object containing all feature toggles.
   */
  async all() {
    const values = {};
    for (const [key, featureToggle] of Object.entries(this.config)) {
      const value = await this.storage.get(key);
      values[key] = value ?? featureToggle.defaultValue;
    }
    return values;
  }

  /**
   * Get feature toggles with a specific tag.
   * @param {string} tag - The tag to filter feature toggles.
   * @returns {Promise<Object>} An object containing the filtered feature toggles.
   */
  async withTag(tag) {
    const configWithTagEntries = Object.entries(this.config).filter(([, config]) => config.tags?.includes(tag));
    const values = {};
    for (const [key, featureToggle] of configWithTagEntries) {
      const value = await this.storage.get(key);
      values[key] = value ?? featureToggle.defaultValue;
    }
    return values;
  }

  /**
   * Reset all feature toggles to their default values.
   */
  async resetDefaults() {
    for (const [key, featureToggle] of Object.entries(this.config)) {
      const defaultValue = this.#getFeatureToggleDefaultValue(featureToggle);
      await this.storage.save({ key, value: defaultValue });
    }
  }

  #getFeatureToggleDefaultValue(featureToggle) {
    if (this.environment === 'test' && featureToggle.devDefaultValues?.test !== undefined) {
      return featureToggle.devDefaultValues.test;
    }

    if (this.environment === 'reviewApp' && featureToggle.devDefaultValues?.reviewApp !== undefined) {
      return featureToggle.devDefaultValues.reviewApp;
    }

    return featureToggle.defaultValue;
  }
}
