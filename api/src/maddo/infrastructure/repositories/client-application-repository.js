import { knex } from '../../../../db/knex-database-connection.js';

export async function getJurisdiction(clientId) {
  const clientApplication = await knex('client_applications').select('jurisdiction').where({ clientId }).first();
  return clientApplication.jurisdiction;
}
