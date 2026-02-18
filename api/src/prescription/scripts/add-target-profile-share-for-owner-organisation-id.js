import { Script } from '../../shared/application/scripts/script.js';
import { ScriptRunner } from '../../shared/application/scripts/script-runner.js';
import { DomainTransaction } from '../../shared/domain/DomainTransaction.js';

const options = {
  dryRun: {
    type: 'boolean',
    describe: 'Run the script without making any database changes',
    default: true,
  },
};

export class AddTargetProfileShareOnOwnerOrganizationId extends Script {
  constructor() {
    super({
      description:
        'Add target profile shares on owner organization Id column in order to delete target-profiles.ownerOrganizationId',
      permanent: false,
      options,
    });
  }

  async handle({ logger, options }) {
    await DomainTransaction.execute(async () => {
      const knexConn = DomainTransaction.getConnection();

      logger.info('BEGIN: AddTargetProfileShareOnOwnerOrganizationId');

      const targetProfileShareToInsert = await knexConn('target-profiles')
        .select(['id as targetProfileId', 'ownerOrganizationId as organizationId'])
        .whereNotNull('ownerOrganizationId');

      logger.info(`Try to add ${targetProfileShareToInsert.length} organization link`);

      const res = await knexConn('target-profile-shares')
        .insert(targetProfileShareToInsert)
        .onConflict(['targetProfileId', 'organizationId'])
        .ignore()
        .returning('id');

      logger.info(`Add ${res.length} organization link`);

      if (options.dryRun) {
        await knexConn.rollback();
        logger.info('ROLLBACK: AddTargetProfileShareOnOwnerOrganizationId (dry run mode)');
        logger.info('Use --dryRun=false to persist changes');
        return;
      }

      logger.info('COMMIT: AddTargetProfileShareOnOwnerOrganizationId');
    });
  }
}

await ScriptRunner.execute(import.meta.url, AddTargetProfileShareOnOwnerOrganizationId);
