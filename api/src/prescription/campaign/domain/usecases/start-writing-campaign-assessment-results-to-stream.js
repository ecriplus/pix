import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone.js';
import utc from 'dayjs/plugin/utc.js';
import _ from 'lodash';
dayjs.extend(utc);
dayjs.extend(timezone);

import { CampaignTypeError } from '../../../../shared/domain/errors.js';
import { CampaignLearningContent } from '../../../../shared/domain/models/index.js';
import {
  CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING,
  CONCURRENCY_HEAVY_OPERATIONS,
} from '../../../../shared/infrastructure/constants.js';
import * as csvSerializer from '../../../../shared/infrastructure/serializers/csv/csv-serializer.js';
import { PromiseUtils } from '../../../../shared/infrastructure/utils/promise-utils.js';
import { CampaignAssessmentResultLine } from '../../infrastructure/exports/campaigns/campaign-assessment-result-line.js';
import { CampaignAssessmentExport } from '../../infrastructure/serializers/csv/campaign-assessment-export.js';

/**
 * @typedef {import ('./index.js').CampaignRepository} CampaignRepository
 * @typedef {import ('./index.js').CampaignParticipationInfoRepository} CampaignParticipationInfoRepository
 * @typedef {import ('./index.js').OrganizationRepository} OrganizationRepository
 * @typedef {import ('./index.js').KnowledgeElementSnapshotRepository} KnowledgeElementSnapshotRepository
 * @typedef {import ('./index.js').CampaignCsvExportService} CampaignCsvExportService
 * @typedef {import ('./index.js').TargetProfileRepository} TargetProfileRepository
 * @typedef {import ('./index.js').LearningContentRepository} LearningContentRepository
 * @typedef {import ('./index.js').StageCollectionRepository} StageCollectionRepository
 * @typedef {import ('./index.js').OrganizationFeatureApi} OrganizationFeatureApi
 * @typedef {import ('./index.js').OrganizationLearnerImportFormat} OrganizationLearnerImportFormat
 */

/**
 * @param {Object} params
 * @param {Number} params.campaignId
 * @param {Object} params.writableStream
 * @param {Object} params.i18n
 * @param {CampaignRepository} params.campaignRepository
 * @param {CampaignParticipationInfoRepository} params.campaignParticipationInfoRepository
 * @param {OrganizationRepository} params.organizationRepository
 * @param {KnowledgeElementSnapshotRepository} params.knowledgeElementSnapshotRepository
 * @param {CampaignCsvExportService} params.campaignCsvExportService
 * @param {TargetProfileRepository} params.targetProfileRepository
 * @param {LearningContentRepository} params.learningContentRepository
 * @param {StageCollectionRepository} params.stageCollectionRepository
 * @param {OrganizationFeatureApi} params.organizationFeatureApi
 * @param {OrganizationLearnerImportFormat} params.organizationLearnerImportFormatRepository
 */
const startWritingCampaignAssessmentResultsToStream = async function ({
  campaignId,
  writableStream,
  i18n,
  campaignRepository,
  campaignParticipationInfoRepository,
  organizationRepository,
  knowledgeElementSnapshotRepository,
  knowledgeElementRepository,
  badgeAcquisitionRepository,
  targetProfileRepository,
  learningContentRepository,
  stageCollectionRepository,
  organizationFeatureApi,
  organizationLearnerImportFormatRepository,
}) {
  let additionalHeaders = [];
  const campaign = await campaignRepository.get(campaignId);
  const translate = i18n.__;

  if (!campaign.isAssessment()) {
    throw new CampaignTypeError();
  }

  const targetProfile = await targetProfileRepository.getByCampaignId(campaign.id);
  const learningContent = await learningContentRepository.findByCampaignId(campaign.id, i18n.getLocale());
  const stageCollection = await stageCollectionRepository.findStageCollection({ campaignId });
  const campaignLearningContent = new CampaignLearningContent(learningContent);

  const organization = await organizationRepository.get(campaign.organizationId);
  const campaignParticipationInfos = await campaignParticipationInfoRepository.findByCampaignId(campaign.id);

  const organizationFeatures = await organizationFeatureApi.getAllFeaturesFromOrganization(campaign.organizationId);
  if (organizationFeatures.hasLearnersImportFeature) {
    const importFormat = await organizationLearnerImportFormatRepository.get(campaign.organizationId);
    additionalHeaders = importFormat.exportableColumns;
  }

  // Create HEADER of CSV
  const headers = new CampaignAssessmentExport({
    outputStream: writableStream,
    organization,
    targetProfile,
    learningContent: campaignLearningContent,
    stageCollection,
    additionalHeaders,
  });

  headers.export();
  // WHY: add \uFEFF the UTF-8 BOM at the start of the text, see:
  // - https://en.wikipedia.org/wiki/Byte_order_mark
  // - https://stackoverflow.com/a/38192870
  const headerLine = '\uFEFF' + csvSerializer.serializeLine(headers);

  writableStream.write(headerLine);

  // No return/await here, we need the writing to continue in the background
  // after this function's returned promise resolves. If we await the map
  // function, node will keep all the data in memory until the end of the
  // complete operation.
  const campaignParticipationInfoChunks = _.chunk(campaignParticipationInfos, CHUNK_SIZE_CAMPAIGN_RESULT_PROCESSING);

  PromiseUtils.map(
    campaignParticipationInfoChunks,
    async (campaignParticipationInfoChunk) => {
      const sharedParticipations = campaignParticipationInfoChunk.filter(({ isShared }) => isShared);
      const startedParticipations = campaignParticipationInfoChunk.filter(
        ({ isShared, isCompleted }) => !isShared && !isCompleted,
      );

      const sharedKnowledgeElementsByUserIdAndCompetenceId =
        await knowledgeElementSnapshotRepository.findMultipleUsersFromUserIdsAndSnappedAtDates(
          sharedParticipations.map(({ userId, sharedAt }) => ({ userId, sharedAt })),
        );

      const othersKnowledgeElementsByUserIdAndCompetenceId = await knowledgeElementRepository.findUniqByUserIds(
        startedParticipations.map(({ userId }) => userId),
      );

      let acquiredBadgesByCampaignParticipations;
      if (targetProfile.hasBadges) {
        const campaignParticipationsIds = campaignParticipationInfoChunk.map(
          (campaignParticipationInfo) => campaignParticipationInfo.campaignParticipationId,
        );
        acquiredBadgesByCampaignParticipations =
          await badgeAcquisitionRepository.getAcquiredBadgesByCampaignParticipations({ campaignParticipationsIds });
      }

      const csvLines = campaignParticipationInfoChunk.map((campaignParticipationInfo) => {
        let participantKnowledgeElementsByCompetenceId = [];

        if (campaignParticipationInfo.isShared) {
          const sharedResultInfo = sharedKnowledgeElementsByUserIdAndCompetenceId.find(
            (knowledElementForSharedParticipation) => {
              const sameUserId = campaignParticipationInfo.userId === knowledElementForSharedParticipation.userId;
              const sameDate =
                campaignParticipationInfo.sharedAt &&
                campaignParticipationInfo.sharedAt.getTime() ===
                  knowledElementForSharedParticipation.snappedAt.getTime();

              return sameUserId && sameDate;
            },
          );

          participantKnowledgeElementsByCompetenceId = campaignLearningContent.getKnowledgeElementsGroupedByCompetence(
            sharedResultInfo.knowledgeElements,
          );
        } else if (campaignParticipationInfo.isCompleted === false) {
          const othersResultInfo = othersKnowledgeElementsByUserIdAndCompetenceId.find(
            (knowledElementForOtherParticipation) =>
              campaignParticipationInfo.userId === knowledElementForOtherParticipation.userId,
          );
          participantKnowledgeElementsByCompetenceId = campaignLearningContent.getKnowledgeElementsGroupedByCompetence(
            othersResultInfo.knowledgeElements,
          );
        }

        const acquiredBadges =
          acquiredBadgesByCampaignParticipations &&
          acquiredBadgesByCampaignParticipations[campaignParticipationInfo.campaignParticipationId]
            ? acquiredBadgesByCampaignParticipations[campaignParticipationInfo.campaignParticipationId].map(
                (badge) => badge.title,
              )
            : [];

        const line = new CampaignAssessmentResultLine({
          organization,
          campaign,
          campaignParticipationInfo,
          targetProfile,
          additionalHeaders,
          learningContent,
          stageCollection,
          participantKnowledgeElementsByCompetenceId,
          acquiredBadges,
          translate,
        });

        return line.toCsvLine();
      });

      writableStream.write(csvLines.join(''));
    },
    { concurrency: CONCURRENCY_HEAVY_OPERATIONS },
  )
    .then(() => {
      writableStream.end();
    })
    .catch((error) => {
      writableStream.emit('error', error);
      throw error;
    });

  const fileName = translate('campaign-export.common.file-name', {
    name: campaign.name,
    id: campaign.id,
    date: dayjs().tz('Europe/Berlin').format('YYYY-MM-DD-HHmm'),
  });
  return { fileName };
};

export { startWritingCampaignAssessmentResultsToStream };
