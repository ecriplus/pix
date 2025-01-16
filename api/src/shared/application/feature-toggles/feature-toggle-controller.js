import { config } from '../../../../src/shared/config.js';
import * as network from '../../../identity-access-management/infrastructure/utils/network.js';
import { featureToggles } from '../../infrastructure/feature-toggles/index.js';
import * as serializer from '../../infrastructure/serializers/jsonapi/feature-toggle-serializer.js';

const getActiveFeatures = async function () {
  const legacyFeatureToggles = config.featureToggles;

  const newFeatureToggles = await featureToggles.withTag('frontend');

  return serializer.serialize({ ...newFeatureToggles, ...legacyFeatureToggles });
};

// TODO: Test route to be removed soon
const getForwardedOrigin = function (request, h) {
  return h.response(network.getForwardedOrigin(request.headers)).code(200);
};

const featureToggleController = { getActiveFeatures, getForwardedOrigin };

export { featureToggleController, getForwardedOrigin };
