import { knex } from '../../db/knex-database-connection.js';
import { CampaignTypes } from '../../src/prescription/shared/domain/constants.js';
import { Script } from '../../src/shared/application/scripts/script.js';
import { ScriptRunner } from '../../src/shared/application/scripts/script-runner.js';

const DEFAULT_CHUNK_SIZE = 10000;
const DEFAULT_PAUSE_DURATION = 2000;

const pause = async (duration) => {
  return new Promise((resolve) => {
    setTimeout(resolve, duration);
  });
};

function getEmptyParticipationKnowlegdeElementSnapshotIds(firstId, size = DEFAULT_CHUNK_SIZE) {
  return knex('knowledge-element-snapshots')
    .whereNull('campaignParticipationId')
    .where('id', '>=', firstId)
    .orderBy('id', 'asc')
    .pluck('id')
    .limit(size);
}

// Définition du script
export class PopulateCampaignParticipationIdScript extends Script {
  constructor() {
    super({
      description:
        'This script will populate the column knowledge-element-snapshots.campaignParticipationId with campaign-participations.id',
      permanent: false,
      options: {
        chunkSize: {
          type: 'number',
          default: DEFAULT_CHUNK_SIZE,
          description: 'number of records to update in one update',
        },
        pauseDuration: {
          type: 'number',
          default: DEFAULT_PAUSE_DURATION,
          description: 'Time in ms between each chunk processing',
        },
      },
    });
  }

  async handle({ options, logger, dependencies = { pause } }) {
    const result = await knex('knowledge-element-snapshots').count().whereNull('campaignParticipationId').first();

    if (result.count === 0) {
      logger.info(
        { event: 'PopulateCampaignParticipationIdScript' },
        `There is no knowledge-element-snapshot with missing campaignParticipationId. Job done !`,
      );
      return;
    } else {
      logger.info(
        { event: 'PopulateCampaignParticipationIdScript' },
        `Try to populate ${result.count} missing campaignParticipationId`,
      );
    }

    let ids = await getEmptyParticipationKnowlegdeElementSnapshotIds(0, options.chunkSize);
    let totalUddatedRows = 0;
    while (ids.length > 0) {
      const updatedRows = await knex('knowledge-element-snapshots')
        .whereNull('campaignParticipationId')
        .updateFrom('campaign-participations')
        .update({
          campaignParticipationId: knex.ref('campaign-participations.id'),
        })
        .where('knowledge-element-snapshots.snappedAt', knex.ref('campaign-participations.sharedAt'))
        .where('knowledge-element-snapshots.userId', knex.ref('campaign-participations.userId'))
        .whereIn('knowledge-element-snapshots.id', ids);

      totalUddatedRows += updatedRows;
      ids = await getEmptyParticipationKnowlegdeElementSnapshotIds(ids[ids.length - 1] + 1, options.chunkSize);
      if (ids.length > 0 && options.pauseDuration > 0) {
        await dependencies.pause(options.pauseDuration);
      }
    }
    logger.info(
      { event: 'PopulateCampaignParticipationIdScript' },
      `${totalUddatedRows} rows updated from "knowledge-element-snapshots"`,
    );
    let emptyRowResult = await knex('knowledge-element-snapshots').count().whereNull('campaignParticipationId').first();
    if (emptyRowResult.count === 0) {
      logger.info(
        { event: 'PopulateCampaignParticipationIdScript' },
        `No row with empty campaignParticipationId to update. Job done !`,
      );
      return;
    } else {
      logger.info(`${emptyRowResult.count} rows with empty campaignParticipationId to update`);
    }
    const anonymisedParticipations = await knex('campaign-participations')
      .select(['campaign-participations.id', 'sharedAt'])
      .join('campaigns', function () {
        this.on('campaigns.id', 'campaign-participations.campaignId').onVal('campaigns.type', CampaignTypes.ASSESSMENT);
      })
      .whereNull('userId')
      .whereNotNull('sharedAt');

    const emptyKeSnapshotParticipations = await knex('knowledge-element-snapshots')
      .whereNull('campaignParticipationId')
      .select(['id', 'snappedAt']);

    logger.info(
      { event: 'PopulateCampaignParticipationIdScript' },
      `Try to populate ${emptyKeSnapshotParticipations.length} keSnapshot from ${anonymisedParticipations.length} anonymised participations`,
    );

    const matchingSnapshotAndParticipations = emptyKeSnapshotParticipations.flatMap(({ id, snappedAt }) => {
      const participations = anonymisedParticipations.filter(
        ({ sharedAt }) => snappedAt.toISOString() === sharedAt.toISOString(),
      );
      if (participations.length !== 1) {
        return [];
      }
      return [{ keSnapshotId: id, campaignParticipationId: participations[0].id }];
    });

    await knex.transaction(async (trx) => {
      for (const row of matchingSnapshotAndParticipations) {
        await trx('knowledge-element-snapshots')
          .update({ campaignParticipationId: row.campaignParticipationId })
          .where({ id: row.keSnapshotId });
      }
    });

    logger.info(
      { event: 'PopulateCampaignParticipationIdScript' },
      `Populate ${matchingSnapshotAndParticipations.length} anonymised participations`,
    );

    emptyRowResult = await knex('knowledge-element-snapshots')
      .select('id')
      .whereNull('campaignParticipationId')
      .pluck('id');

    if (emptyRowResult.length === 0) {
      logger.info(
        { event: 'PopulateCampaignParticipationIdScript' },
        `No row with empty campaignParticipationId to update. Job done !`,
      );
    } else {
      logger.info(
        { event: 'PopulateCampaignParticipationIdScript', ids: emptyRowResult },
        `${emptyRowResult.length} rows with empty campaignParticipationId to update`,
      );
    }
  }
}

// Exécution du script
await ScriptRunner.execute(import.meta.url, PopulateCampaignParticipationIdScript);
