import { knex } from '../../../../db/knex-database-connection.js';
import { LtiPlatformRegistration } from '../../domain/models/LtiPlatformRegistration.js';

export const ltiPlatformRegistrationRepository = {
  async findByClientId(clientId) {
    const ltiPlatformRegistrationDTO = await knex
      .select('*')
      .from('lti_platform_registrations')
      .where('clientId', clientId)
      .first();

    if (!ltiPlatformRegistrationDTO) {
      return null;
    }

    return new LtiPlatformRegistration(ltiPlatformRegistrationDTO);
  },
};
