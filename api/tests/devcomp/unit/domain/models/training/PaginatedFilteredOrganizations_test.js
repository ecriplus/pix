import { FilteredOrganization } from '../../../../../../src/devcomp/domain/models/trainings/FilteredOrganization.js';
import { PaginatedFilteredOrganizations } from '../../../../../../src/devcomp/domain/models/trainings/PaginatedFilteredOrganizations.js';
import { expect } from '../../../../../test-helper.js';

describe('Unit | Devcomp | Domain | Models | PaginatedFilteredOrganizations', function () {
  context('when organization id belongs to excludedOrganizationIds', function () {
    it('should create a PaginatedFilteredOrganizations with pagination and at least one excluded organization as attributes', function () {
      // given
      const page = { number: 1, size: 10 };
      const pagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };
      const organizations = [
        {
          id: 1,
          type: 'SCO',
          name: 'Orga 1',
          externalId: 'SCO_Orga 1',
        },
        {
          id: 2,
          type: 'SCO',
          name: 'Orga 2',
          externalId: 'SCO_Orga 2',
        },
      ];
      const excludedOrganizationIds = [1];
      const targetProfileTrainingId = '3';

      // when
      const { models, pagination: paginationData } = new PaginatedFilteredOrganizations({
        organizations,
        pagination,
        excludedOrganizationIds,
        targetProfileTrainingId,
      });

      // then
      models.forEach((filteredOrganization) => {
        expect(filteredOrganization).instanceOf(FilteredOrganization);
      });
      expect(models[0].isExcluded).to.be.true;
      expect(models[0].id).to.equal(`${targetProfileTrainingId}-${organizations[0].id}`);
      expect(models[1].isExcluded).to.be.false;
      expect(paginationData).to.deep.equal(pagination);
    });
  });

  context('when no organization is excluded', function () {
    it('should create a PaginatedFilteredOrganizations with pagination and no excluded organization as attributes', function () {
      // given
      const page = { number: 1, size: 10 };
      const pagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };
      const organizations = [
        {
          id: 1,
          type: 'SCO',
          name: 'Orga 1',
          externalId: 'SCO_Orga 1',
        },
        {
          id: 2,
          type: 'SCO',
          name: 'Orga 2',
          externalId: 'SCO_Orga 2',
        },
      ];
      const excludedOrganizationIds = [];

      // when
      const { models } = new PaginatedFilteredOrganizations({
        organizations,
        pagination,
        excludedOrganizationIds,
      });

      // then
      expect(models[0].isExcluded).to.be.false;
      expect(models[1].isExcluded).to.be.false;
    });
  });
});
