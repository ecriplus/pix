import { FilteredOrganization } from './FilteredOrganization.js';

export class PaginatedFilteredOrganizations {
  constructor({ organizations = [], excludedOrganizationIds = [], pagination, targetProfileTrainingId }) {
    this.models = this.#createFilteredOrganizations({
      organizations,
      excludedOrganizationIds,
      targetProfileTrainingId,
    });
    this.pagination = pagination;
  }

  #createFilteredOrganizations({ organizations, excludedOrganizationIds, targetProfileTrainingId }) {
    return organizations.map((organization) => {
      const isExcluded = this.#computeIsExcluded({ organization, excludedOrganizationIds });
      return new FilteredOrganization({
        ...organization,
        isExcluded,
        targetProfileTrainingId,
        organizationId: organization.id,
      });
    });
  }

  #computeIsExcluded({ organization, excludedOrganizationIds }) {
    let isExcluded = false;
    if (excludedOrganizationIds.length > 0 && excludedOrganizationIds.includes(organization.id)) {
      isExcluded = true;
    }

    return isExcluded;
  }
}
