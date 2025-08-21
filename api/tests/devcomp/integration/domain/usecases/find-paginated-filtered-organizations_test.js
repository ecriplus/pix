import { FilteredOrganization } from '../../../../../src/devcomp/domain/models/trainings/FilteredOrganization.js';
import { usecases } from '../../../../../src/devcomp/domain/usecases/index.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Devcomp | Domain | UseCases | findPaginatedFilteredOrganizations', function () {
  context('when an organization is already excluded', function () {
    it('should return a list of organizations with "isExcluded" at true for the excluded one', async function () {
      // given
      const { id: trainingId } = databaseBuilder.factory.buildTraining();
      const excludedOrganization = databaseBuilder.factory.buildOrganization({
        type: 'SCO',
        name: 'Orga 1',
        externalId: 'SCO_Orga 1',
      });
      const notExcludedOrganization = databaseBuilder.factory.buildOrganization({
        type: 'SCO',
        name: 'Orga 2',
        externalId: 'SCO_Orga 2',
      });
      const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();
      const { id: targetProfileTrainingId } = databaseBuilder.factory.buildTargetProfileTraining({
        trainingId,
        targetProfileId,
      });
      databaseBuilder.factory.buildTargetProfileShare({ targetProfileId, organizationId: excludedOrganization.id });
      databaseBuilder.factory.buildTargetProfileShare({ targetProfileId, organizationId: notExcludedOrganization.id });
      databaseBuilder.factory.buildTargetProfileTrainingOrganization({
        targetProfileTrainingId,
        organizationId: excludedOrganization.id,
      });
      await databaseBuilder.commit();

      const filter = {};
      const page = { number: 1, size: 10 };
      const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

      const expectedResult = {
        pagination: expectedPagination,
        models: [
          new FilteredOrganization({
            ...excludedOrganization,
            organizationId: excludedOrganization.id,
            targetProfileTrainingId,
            isExcluded: true,
          }),
          new FilteredOrganization({
            ...notExcludedOrganization,
            organizationId: notExcludedOrganization.id,
            targetProfileTrainingId,
            isExcluded: false,
          }),
        ],
      };

      // when
      const result = await usecases.findPaginatedFilteredOrganizations({
        trainingId,
        targetProfileId,
        filter,
        page,
      });

      // then
      expect(result.models).to.deep.equal(expectedResult.models);
      result.models.forEach((model) => expect(model).instanceOf(FilteredOrganization));
      expect(result.pagination).to.deep.equal(expectedPagination);
    });
  });
  context('when there are no excluded organizations', function () {
    it('should return a list of organizations with "isExcluded" at false', async function () {
      // given
      const { id: trainingId } = databaseBuilder.factory.buildTraining();
      const notExcludedOrganization = databaseBuilder.factory.buildOrganization({
        type: 'SCO',
        name: 'Orga 1',
        externalId: 'SCO_Orga 1',
      });
      const anotherNotExcludedOrganization = databaseBuilder.factory.buildOrganization({
        type: 'SCO',
        name: 'Orga 2',
        externalId: 'SCO_Orga 2',
      });
      const { id: targetProfileId } = databaseBuilder.factory.buildTargetProfile();
      const { id: targetProfileTrainingId } = databaseBuilder.factory.buildTargetProfileTraining({
        trainingId,
        targetProfileId,
      });
      databaseBuilder.factory.buildTargetProfileShare({ targetProfileId, organizationId: notExcludedOrganization.id });
      databaseBuilder.factory.buildTargetProfileShare({
        targetProfileId,
        organizationId: anotherNotExcludedOrganization.id,
      });

      await databaseBuilder.commit();

      const filter = {};
      const page = { number: 1, size: 10 };
      const expectedPagination = { page: page.number, pageSize: page.size, pageCount: 1, rowCount: 2 };

      const models = [notExcludedOrganization, anotherNotExcludedOrganization].map(
        (organization) =>
          new FilteredOrganization({
            ...organization,
            organizationId: organization.id,
            targetProfileTrainingId,
            isFiltered: false,
          }),
      );

      const expectedResult = {
        pagination: expectedPagination,
        models,
      };

      // when
      const result = await usecases.findPaginatedFilteredOrganizations({
        trainingId,
        targetProfileId,
        filter,
        page,
      });

      // then
      expect(result.models).to.deep.equal(expectedResult.models);
      result.models.forEach((model) => expect(model).instanceOf(FilteredOrganization));
      expect(result.pagination).to.deep.equal(expectedPagination);
    });
  });
});
