import { knex } from '../../../db/knex-database-connection.js';
import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { NON_OIDC_IDENTITY_PROVIDERS } from '../domain/constants/identity-providers.js';
import * as authenticationMethodRepository from '../infrastructure/repositories/authentication-method.repository.js';
import * as userRepository from '../infrastructure/repositories/user.repository.js';

export class DeleteExScoAuthenticationMethodsScript extends Script {
  constructor() {
    super({
      description:
        'Deletes authentication methods for users that are no longer SCO and that have already used the account recovery demand.',
      permanent: false,
      options: {
        dryRun: {
          type: 'boolean',
          describe: 'If present, the script will not make any changes to the database',
          default: false,
        },
      },
    });
  }

  async handle({ options, logger, dependencies = { authenticationMethodRepository, userRepository } }) {
    const { dryRun } = options;
    const exScoUserIdsWithOldCampaignParticipation = await _getUserList();
    if (dryRun) {
      logger.info(
        `DryRun mode, ${exScoUserIdsWithOldCampaignParticipation.length} user authentication methods to be processed.`,
      );
      return;
    } else {
      for (const userId of exScoUserIdsWithOldCampaignParticipation) {
        await dependencies.authenticationMethodRepository.removeByUserIdAndIdentityProvider({
          userId,
          identityProvider: NON_OIDC_IDENTITY_PROVIDERS.GAR.code,
        });
        await dependencies.userRepository.updateUsername({ id: userId, username: null });
      }
      logger.info(
        `The script has modified ${exScoUserIdsWithOldCampaignParticipation.length} user's authentication methods`,
      );
    }
  }
}

await ScriptRunner.execute(import.meta.url, DeleteExScoAuthenticationMethodsScript);

function _getDate12MonthsAgo() {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date;
}

async function _getUserList() {
  const exScoUserIdsWithOldCampaignParticipation = await knex('campaign-participations')
    .join('campaigns', 'campaigns.id', '=', 'campaign-participations.campaignId')
    .join('organizations', 'organizations.id', '=', 'campaigns.organizationId')
    .where('organizations.type', 'SCO')
    .whereIn('campaign-participations.userId', function () {
      this.select('userId').from('account-recovery-demands').where({ used: true });
    })
    .andWhere('campaign-participations.createdAt', '<', _getDate12MonthsAgo())
    .pluck('userId');
  return exScoUserIdsWithOldCampaignParticipation;
}
