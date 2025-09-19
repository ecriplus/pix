import { AdministrationTeam } from '../../../../src/organizational-entities/domain/models/AdministrationTeam.js';

const buildAdministrationTeam = function ({ id = 1, name = 'Équipe Pix' } = {}) {
  return new AdministrationTeam({ id, name });
};

export { buildAdministrationTeam };
