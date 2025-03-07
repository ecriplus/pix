import { knex } from '../../../../db/knex-database-connection.js';
import { httpAgent } from '../../../shared/infrastructure/http-agent.js';
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

    const { data: platformOpenIdConfig } = await httpAgent.get({
      url: ltiPlatformRegistrationDTO.platformOpenIdConfigUrl,
    });

    return new LtiPlatformRegistration({ ...ltiPlatformRegistrationDTO, platformOpenIdConfig });
  },
};
