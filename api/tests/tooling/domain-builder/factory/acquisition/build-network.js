import { Network } from '../../../../../src/organizational-entities/domain/models/Network.js';
const buildNetwork = function ({ id = 1234, name = 'Mon réseau' } = {}) {
  return new Network({ id, name });
};

export { buildNetwork };
