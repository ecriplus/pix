import { config } from '../../../../src/shared/config.js';
import { featureToggles } from '../../infrastructure/feature-toggles/index.js';
import * as serializer from '../../infrastructure/serializers/jsonapi/feature-toggle-serializer.js';

const getActiveFeatures = async function () {
  const legacyFeatureToggles = config.featureToggles;

  const newFeatureToggles = await featureToggles.withTag('frontend');

  return serializer.serialize({ ...newFeatureToggles, ...legacyFeatureToggles });
};

const featureToggleController = { getActiveFeatures };

export { featureToggleController };
