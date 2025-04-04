import { CenterForAdmin } from '../../../../src/organizational-entities/domain/models/CenterForAdmin.js';

const buildCenterForAdmin = function ({ center, dataProtectionOfficer } = {}) {
  return new CenterForAdmin({
    center,
    dataProtectionOfficer,
  });
};

export { buildCenterForAdmin };
