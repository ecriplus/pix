import { knex } from '../../../../../db/knex-database-connection.js';
import { DomainTransaction } from '../../../../shared/domain/DomainTransaction.js';
import { filterByFullName } from '../../../../shared/infrastructure/utils/filter-utils.js';
import { fetchPage } from '../../../../shared/infrastructure/utils/knex-utils.js';
import { CampaignParticipationStatuses } from '../../../shared/domain/constants.js';
import { CampaignParticipantActivity } from '../../domain/read-models/CampaignParticipantActivity.js';

// TODO move to its own model
export class ParticipantActivityFilters {
  /** @type string */
  #status;
  /** @type string[] */
  #groups;
  /** @type string[] */
  #divisions;

  constructor({ status = null, search = null, groups = [], divisions = [] }) {
    this.#status = status;
    this.search = search;
    this.#groups = groups;
    this.#divisions = divisions;
  }

  get participationStatus() {
    if (this.#status === CampaignParticipationStatuses.STARTED)
      return [CampaignParticipationStatuses.STARTED, CampaignParticipationStatuses.TO_SHARE];

    if (!this.#status)
      return [
        CampaignParticipationStatuses.SHARED,
        CampaignParticipationStatuses.STARTED,
        CampaignParticipationStatuses.TO_SHARE,
      ];

    return [this.#status];
  }

  get groups() {
    if (this.#groups.length === 0) return null;
    return this.#groups?.map((group) => group.toLowerCase().trim());
  }

  get divisions() {
    if (this.#divisions.length === 0) return null;
    return this.#divisions?.map((division) => division.toLowerCase().trim());
  }

  get showNotStarted() {
    return this.#status === 'NOT_STARTED';
  }
}

const campaignParticipantActivityRepository = {
  async findPaginatedByCampaignId({ page = { size: 25 }, campaignId, filters = {} }) {
    const knexConn = DomainTransaction.getConnection();
    const activityFilters = new ParticipantActivityFilters(filters);

    const query = knexConn('view-active-organization-learners')
      .select(
        'view-active-organization-learners.id AS organizationLearnerId',
        'view-active-organization-learners.firstName',
        'view-active-organization-learners.lastName',
        'campaign-participations.id AS campaignParticipationId',
        'campaign-participations.participantExternalId',
        'campaign-participations.status',
        knex('campaign-participations')
          .whereRaw('"organizationLearnerId" = "view-active-organization-learners"."id"')
          .and.whereNull('campaign-participations.deletedAt')
          .and.where('campaignId', campaignId)
          .count('id')
          .as('participationCount'),
      )
      .leftJoin('campaign-participations', function () {
        this.on('campaign-participations.organizationLearnerId', 'view-active-organization-learners.id')
          .andOnVal('campaign-participations.campaignId', campaignId)
          .andOnVal('isImproved', false)
          .andOnNull('campaign-participations.deletedAt');
      })
      .where(
        'view-active-organization-learners.organizationId',
        knex('campaigns').select('organizationId').where('id', campaignId),
      )
      .where('view-active-organization-learners.isDisabled', false)
      .modify(filterParticipations, activityFilters)
      .orderByRaw('LOWER(??) ASC, LOWER(??) ASC', ['lastName', 'firstName']);

    const { results, pagination } = await fetchPage({ queryBuilder: query, paginationParams: page });

    const campaignParticipantsActivities = results.map((result) => new CampaignParticipantActivity(result));

    return {
      campaignParticipantsActivities,
      pagination,
    };
  },
};

function filterParticipations(queryBuilder, filters) {
  queryBuilder
    .modify(filterByDivisions, filters)
    .modify(filterByStatus, filters)
    .modify(filterByGroup, filters)
    .modify(filterBySearch, filters);
}

function filterBySearch(queryBuilder, filters) {
  if (filters.search) {
    filterByFullName(
      queryBuilder,
      filters.search,
      'view-active-organization-learners.firstName',
      'view-active-organization-learners.lastName',
    );
  }
}

function filterByDivisions(queryBuilder, filters) {
  if (filters.divisions) {
    queryBuilder.whereIn(knex.raw('LOWER("view-active-organization-learners"."division")'), filters.divisions);
  }
}

function filterByStatus(queryBuilder, filters) {
  if (filters.showNotStarted) {
    queryBuilder.whereNull('campaign-participations.campaignId');
  } else {
    queryBuilder.whereIn('campaign-participations.status', filters.participationStatus);
  }
}

function filterByGroup(queryBuilder, filters) {
  if (filters.groups) {
    queryBuilder.whereIn(knex.raw('LOWER("view-active-organization-learners"."group")'), filters.groups);
  }
}

export { campaignParticipantActivityRepository };
