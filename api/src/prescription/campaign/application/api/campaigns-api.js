import { withTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { DEFAULT_PAGINATION } from '../../../../shared/infrastructure/utils/knex-utils.js';
import { AssessmentCampaignParticipation } from '../../domain/read-models/CampaignParticipation.js';
import { usecases } from '../../domain/usecases/index.js';
import { Campaign } from './models/Campaign.js';
import { CampaignListItem } from './models/CampaignListItem.js';
import {
  AssessmentCampaignParticipation as AssessmentCampaignParticipationAPI,
  ProfilesCollectionCampaignParticipation as ProfilesCollectionCampaignParticipationAPI,
} from './models/CampaignParticipation.js';
import { SavedCampaign } from './models/SavedCampaign.js';
/**
 * @module CampaignApi
 */

/**
 * @typedef CampaignPayload
 * @type {object}
 * @property {string} name
 * @property {string} title
 * @property {number} targetProfileId
 * @property {number} organizationId
 * @property {number} creatorId
 * @property {string} customLandingPageText
 */

/**
 * @typedef UserNotAuthorizedToCreateCampaignError
 * @type {object}
 * @property {string} message
 */

/**
 * @function
 * @name save
 *
 * @param {CampaignPayload|Array<CampaignPayload>} campaigns
 * @returns {Promise<SavedCampaign|Array<CampaignPayload>>}
 * @throws {UserNotAuthorizedToCreateCampaignError} to be improved to handle different error types
 */
export const save = async (campaigns) => {
  if (Array.isArray(campaigns)) {
    const savedCampaign = await usecases.createCampaigns({
      campaignsToCreate: campaigns,
    });

    return savedCampaign.map((campaign) => new SavedCampaign(campaign));
  } else {
    const savedCampaign = await usecases.createCampaign({
      campaign: {
        ...campaigns,
        type: 'ASSESSMENT',
        ownerId: campaigns.creatorId,
        multipleSendings: false,
      },
    });

    return new SavedCampaign(savedCampaign);
  }
};

/**
 * @function
 * @name get
 *
 * @param {number} campaignId
 * @returns {Promise<Campaign>}
 */
export const get = async (campaignId) => {
  const getCampaign = await usecases.getCampaign({ campaignId });
  return new Campaign(getCampaign);
};

/**
 * @function
 * @name getByCampaignParticipationId
 *
 * @param {number} campaignParticipationId
 * @returns {Promise<Campaign|null>}
 */
export const getByCampaignParticipationId = async (campaignParticipationId) => {
  const campaign = await usecases.getCampaignOfCampaignParticipation({ campaignParticipationId });
  if (!campaign) return null;
  return new Campaign(campaign);
};

/**
 * @function
 * @name getByCode
 *
 * @param {number} code
 * @param {locale} string
 * @returns {Promise<Campaign>}
 */
export const getByCode = async (code, locale) => {
  const getCampaign = await usecases.getCampaignByCode({ code, locale });
  return new Campaign(getCampaign);
};

/**
 * @typedef UpdateCampaignPayload
 * @type {object}
 * @property {number} campaignId
 * @property {string} name
 * @property {string} title
 * @property {string} customLandingPageText
 */

/**
 * @function
 * @name update
 *
 * @param {UpdateCampaignPayload} payload
 * @returns {Promise<Campaign>}
 */
export const update = async (payload) => {
  const updatedCampaign = await usecases.updateCampaign(payload);
  return new Campaign(updatedCampaign);
};

/**
 * @typedef PageDefinition
 * @type {object}
 * @property {number} size
 * @property {Page} number
 */

/**
 * @typedef CampaignListPayload
 * @type {object}
 * @property {number} organizationId
 * @property {PageDefinition} page
 * @property {boolean} withCoverRate
 */

/**
 * @typedef Pagination
 * @type {object}
 * @property {number} page
 * @property {number} pageSize
 * @property {number} rowCount
 * @property {number} pageCount
 */

/**
 * @typedef CampaignListResponse
 * @type {object}
 * @property {Array<CampaignListItem>} models
 * @property {Pagination} meta
 */

/**
 * @function
 * @name findAllForOrganization
 *
 * @param {CampaignListPayload} payload
 * @returns {Promise<CampaignListResponse>}
 */
export const findAllForOrganization = async (payload) => {
  const { models: campaigns, meta } = await usecases.findPaginatedFilteredOrganizationCampaigns({
    organizationId: payload.organizationId,
    page: payload.page,
    locale: payload.locale,
    withCoverRate: payload.withCoverRate ?? false,
  });

  const campaignsList = campaigns.map((campaign) => new CampaignListItem(campaign));

  return { models: campaignsList, meta };
};

/**
 * @function
 * @name findCampaignSkillIdsForCampaignParticipations
 *
 * @param {Array<Number>} campaignParticipationIds
 * @returns {Promise<Array<Number>>}
 */
export const findCampaignSkillIdsForCampaignParticipations = async (campaignParticipationIds) => {
  return usecases.findCampaignSkillIdsForCampaignParticipations({
    campaignParticipationIds,
  });
};

/**
 * @typedef CampaignParticipationsPayload
 * @type {object}
 * @property {number} campaignId
 * @property {string} since
 * @property {PageDefinition} page
 */

/**
 * @function
 * @name getCampaignParticipations
 *
 * @param {CampaignParticipationsPayload} payload
 * @returns {Promise<{models: Array<AssessmentCampaignParticipationAPI>|Array<ProfilesCollectionCampaignParticipationAPI>, meta: Pagination}>}
 */
export const getCampaignParticipations = async function ({ campaignId, page, since }) {
  const { models: campaignParticipations, meta } = await usecases.getCampaignParticipations({
    campaignId,
    page,
    since,
  });
  return {
    models: campaignParticipations.map((campaignParticipation) =>
      campaignParticipation instanceof AssessmentCampaignParticipation
        ? new AssessmentCampaignParticipationAPI(campaignParticipation)
        : new ProfilesCollectionCampaignParticipationAPI(campaignParticipation),
    ),
    meta,
  };
};

/**
 * @typedef DeleteActiveCampaignPayload
 * @type {object}
 * @property {number} organizationId
 * @property {Array<number>} campaignIds
 * @property {number} userId
 * @property {PageDefinition} page
 */

/**
 * @function
 * @name deleteActiveCampaigns
 *
 * @param {DeleteActiveCampaignPayload} payload
 * @returns {Promise<void>}
 */
export const deleteActiveCampaigns = withTransaction(
  async ({
    userId,
    organizationId,
    page = { size: DEFAULT_PAGINATION.PAGE_SIZE, number: DEFAULT_PAGINATION.PAGE },
  }) => {
    let campaignIdsToDelete = [];
    let results;
    do {
      results = await usecases.findPaginatedCampaignManagements({ organizationId, page });
      campaignIdsToDelete = campaignIdsToDelete.concat(
        results.models.flatMap(({ id, deletedAt }) => (deletedAt ? [] : [id])),
      );
      page.number = results.meta.page + 1;
    } while (results.models.length > 0);
    await usecases.deleteCampaigns({ userId, organizationId, campaignIds: campaignIdsToDelete });
  },
);
