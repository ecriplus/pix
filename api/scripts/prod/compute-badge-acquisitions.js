require('dotenv').config();
const _ = require('lodash');
const bluebird = require('bluebird');
const { performance } = require('perf_hooks');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');
const { knex, disconnect } = require('../../db/knex-database-connection');
const CampaignParticipation = require('../../lib/domain/models/CampaignParticipation');
const logger = require('../../lib/infrastructure/logger');
const badgeCriteriaService = require('../../lib/domain/services/badge-criteria-service');
const badgeAcquisitionRepository = require('../../lib/infrastructure/repositories/badge-acquisition-repository');
const badgeRepository = require('../../lib/infrastructure/repositories/badge-repository');
const knowledgeElementRepository = require('../../lib/infrastructure/repositories/knowledge-element-repository');
const targetProfileRepository = require('../../lib/infrastructure/repositories/target-profile-repository');
const cache = require('../../lib/infrastructure/caches/learning-content-cache');

async function main() {
  const startTime = performance.now();
  logger.info(`Script compute badge acquisitions has started`);
  const { idMin, idMax, dryRun } = _getAllArgs();
  const numberOfCreatedBadges = await computeAllBadgeAcquisitions({ idMin, idMax, dryRun });
  logger.info(`${numberOfCreatedBadges} badges created`);
  const endTime = performance.now();
  const duration = Math.round(endTime - startTime);
  logger.info(`Script has ended: took ${duration} milliseconds`);
}

function _getAllArgs() {
  return yargs(hideBin(process.argv))
    .option('idMin', {
      type: 'number',
      demand: true,
      description: 'id de la première campagne participation',
    })
    .option('idMax', {
      type: 'number',
      demand: true,
      description: 'id de la dernière campagne participation',
    })
    .option('dryRun', {
      type: 'boolean',
      description: 'permet de lancer le script sans créer les badges manquants',
    })
    .help().argv;
}

async function computeAllBadgeAcquisitions({ idMin, idMax, dryRun }) {
  const campaignParticipations = await getCampaignParticipationsBetweenIds({ idMin, idMax });
  const numberOfBadgeCreatedByCampaignParticipation = await bluebird.mapSeries(
    campaignParticipations,
    async (campaignParticipation, index) => {
      logger.info(`${index}/${campaignParticipations.length}`);
      return computeBadgeAcquisition({
        campaignParticipation,
        dryRun,
        badgeCriteriaService,
        badgeAcquisitionRepository,
        badgeRepository,
        knowledgeElementRepository,
        targetProfileRepository,
      });
    }
  );
  return _.sum(numberOfBadgeCreatedByCampaignParticipation);
}

async function computeBadgeAcquisition({
  campaignParticipation,
  dryRun = false,
  badgeCriteriaService,
  badgeAcquisitionRepository,
  badgeRepository,
  knowledgeElementRepository,
  targetProfileRepository,
} = {}) {
  const associatedBadges = await _fetchPossibleCampaignAssociatedBadges(campaignParticipation, badgeRepository);
  if (_.isEmpty(associatedBadges)) {
    return 0;
  }
  const targetProfile = await targetProfileRepository.getByCampaignParticipationId(campaignParticipation.id);
  const knowledgeElements = await knowledgeElementRepository.findUniqByUserId({ userId: campaignParticipation.userId });

  const validatedBadgesByUser = associatedBadges.filter((badge) =>
    badgeCriteriaService.areBadgeCriteriaFulfilled({ knowledgeElements, targetProfile, badge })
  );

  const badgesAcquisitionToCreate = validatedBadgesByUser.map((badge) => {
    return {
      badgeId: badge.id,
      userId: campaignParticipation.userId,
      campaignParticipationId: campaignParticipation.id,
    };
  });

  if (!_.isEmpty(badgesAcquisitionToCreate) && !dryRun) {
    await badgeAcquisitionRepository.createOrUpdate(badgesAcquisitionToCreate);
  }

  return badgesAcquisitionToCreate.length;
}

function _fetchPossibleCampaignAssociatedBadges(campaignParticipation, badgeRepository) {
  return badgeRepository.findByCampaignParticipationId(campaignParticipation.id);
}

async function getCampaignParticipationsBetweenIds({ idMin, idMax }) {
  const campaignParticipations = await knex('campaign-participations').whereBetween('id', [idMin, idMax]);
  return campaignParticipations.map((campaignParticipation) => new CampaignParticipation(campaignParticipation));
}

const isLaunchedFromCommandLine = require.main === module;

(async () => {
  if (isLaunchedFromCommandLine) {
    try {
      await main();
    } catch (error) {
      logger.error(error);
      process.exitCode = 1;
    } finally {
      await disconnect();
      cache.quit();
    }
  }
})();

module.exports = { computeAllBadgeAcquisitions, computeBadgeAcquisition, getCampaignParticipationsBetweenIds };
