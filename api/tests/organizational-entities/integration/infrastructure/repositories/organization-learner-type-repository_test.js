import * as organizationLearnerTypeRepository from '../../../../../src/organizational-entities/infrastructure/repositories/organization-learner-type-repository.js';
import { databaseBuilder, domainBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Repository | organization-learner-type-repository', function () {
  describe('#findAll', function () {
    it('should return all organization learner types ordered by name', async function () {
      // given
      const firstOrganizationLearnerType = databaseBuilder.factory.buildOrganizationLearnerType({
        name: 'Type B',
        createdAt: new Date('2020-01-01'),
      });
      const secondOrganizationLearnerType = databaseBuilder.factory.buildOrganizationLearnerType({
        name: 'Type A',
        createdAt: new Date('2021-01-02'),
      });
      await databaseBuilder.commit();

      // when
      const result = await organizationLearnerTypeRepository.findAll();

      // then
      expect(result).to.have.deep.members([
        domainBuilder.acquisition.buildOrganizationLearnerType({
          name: secondOrganizationLearnerType.name,
        }),
        domainBuilder.acquisition.buildOrganizationLearnerType({ name: firstOrganizationLearnerType.name }),
      ]);
    });

    it('should return an empty array if there is no organization learner type', async function () {
      // when
      const result = await organizationLearnerTypeRepository.findAll();

      // then
      expect(result).to.deep.equal([]);
    });
  });
});
