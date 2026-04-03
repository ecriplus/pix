import * as organizationLearnerFilterRepository from '../../../../../../src/prescription/learner-management/infrastructure/repositories/organization-learner-filter-repository.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../../test-helper.js';

describe('Integration | Repository | Organization Learner Management | Organization Learner Filter', function () {
  describe('#deleteOrganizationLearnerFiltersFromOrganizationId', function () {
    it('should delete organization learner filter from organizationId', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;

      databaseBuilder.factory.prescription.organizationLearners.buildOrganizationLearnerFilter({
        organizationId,
        attributeName: 'division',
        values: ['E3', '8R', 'Z6'],
      });

      await databaseBuilder.commit();

      // when
      await organizationLearnerFilterRepository.deleteOrganizationLearnerFiltersFromOrganizationId(organizationId);

      // then
      const result = await knex('organization_learner_filters').where('organization_id', organizationId);

      expect(result).lengthOf(0);
    });

    it('should not delete organization learner filter from another organizationId', async function () {
      // given
      const organizationId = databaseBuilder.factory.buildOrganization().id;

      const anotherOrganizationId = databaseBuilder.factory.buildOrganization().id;
      databaseBuilder.factory.prescription.organizationLearners.buildOrganizationLearnerFilter({
        organizationId: anotherOrganizationId,
        attributeName: 'division',
        values: ['E3', '8R', 'Z6'],
      });

      await databaseBuilder.commit();

      // when
      await organizationLearnerFilterRepository.deleteOrganizationLearnerFiltersFromOrganizationId(organizationId);

      // then
      const result = await knex('organization_learner_filters').where('organization_id', anotherOrganizationId);

      expect(result).lengthOf(1);
      expect(result[0].attribute_name).equal('division');
      expect(result[0].values).deep.equal(['E3', '8R', 'Z6']);
    });
  });
});
