import { Script } from '../../application/scripts/script.js';
import { ScriptRunner } from '../../application/scripts/script-runner.js';
import { featureToggles } from './index.js';

export class FeatureToggleScript extends Script {
  constructor() {
    super({
      description: 'Get or set feature toggles',
      permanent: true,
      options: {
        list: {
          alias: 'l',
          describe: 'List all feature toggles',
          type: 'boolean',
        },
        key: {
          alias: 'k',
          describe: 'Feature toggle key to get or set',
          type: 'string',
        },
        value: {
          alias: 'v',
          describe: 'Feature toggle value to set',
          type: 'string',
        },
      },
    });
  }

  async handle({ options, logger, featureTogglesClient = featureToggles }) {
    const { list, key, value } = options;

    // List all feature toggles
    if (list || (!key && !value)) {
      const all = await featureTogglesClient.all();
      for (const [key, value] of Object.entries(all)) {
        logger.warn(`Feature toggle "${key}" is set to "${value}"`);
      }
      return;
    }

    // Set a feature toggle
    const featureToggle = featureTogglesClient.config[key];
    if (!featureToggle) {
      throw new Error(`Feature toggle "${key}" does not exist`);
    }

    if (value !== undefined) {
      if (featureToggle.type === 'boolean') {
        await featureTogglesClient.set(key, value === 'true');
      } else if (featureToggle.type === 'number') {
        await featureTogglesClient.set(key, Number(value));
      } else {
        await featureTogglesClient.set(key, value);
      }
    }

    // Get a feature toggle
    logger.warn(`Feature toggle "${key}" is set to "${await featureTogglesClient.get(key)}"`);
  }
}

ScriptRunner.execute(import.meta.url, FeatureToggleScript);
