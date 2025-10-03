import { knex } from '../../../../db/knex-database-connection.js';
import { AdministrationTeam } from '../../domain/models/AdministrationTeam.js';

const findAll = async function () {
  const administrationTeams = await knex.select('id', 'name').from('administration_teams').orderBy('name', 'asc');

  return administrationTeams.map(_toDomain);
};

const getById = async function (id) {
  const administrationTeam = await knex.select('id', 'name').from('administration_teams').where({ id }).first();

  if (!administrationTeam) {
    return null;
  }

  return _toDomain(administrationTeam);
};

const _toDomain = function (administrationTeamDTO) {
  return new AdministrationTeam({
    ...administrationTeamDTO,
  });
};

export { findAll, getById };
