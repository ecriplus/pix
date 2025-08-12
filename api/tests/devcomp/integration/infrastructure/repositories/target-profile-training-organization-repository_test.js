import * as targetProfileTrainingOrganizationRepository from '../../../../../src/devcomp/infrastructure/repositories/training-profile-training-organization-repository.js';
import { databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Repository | target-profile-training-organization', function () {
  describe('#getOrganizations', function () {
    it('should return organization ids', async function () {
      // given
      const organization1 = databaseBuilder.factory.buildOrganization();
      const organization2 = databaseBuilder.factory.buildOrganization();

      const targetProfile1 = databaseBuilder.factory.buildTargetProfile();
      const targetProfile2 = databaseBuilder.factory.buildTargetProfile();

      const training1 = databaseBuilder.factory.buildTraining({
        title: 'training 1',
        locale: 'fr-fr',
      });

      const targetProfileTraining1 = databaseBuilder.factory.buildTargetProfileTraining({
        trainingId: training1.id,
        targetProfileId: targetProfile1.id,
      });
      const targetProfileTraining2 = databaseBuilder.factory.buildTargetProfileTraining({
        trainingId: training1.id,
        targetProfileId: targetProfile2.id,
      });

      databaseBuilder.factory.buildTargetProfileTrainingOrganization({
        targetProfileTrainingId: targetProfileTraining1.id,
        organizationId: organization1.id,
      });
      databaseBuilder.factory.buildTargetProfileTrainingOrganization({
        targetProfileTrainingId: targetProfileTraining2.id,
        organizationId: organization2.id,
      });
      await databaseBuilder.commit();

      // when
      const organizationIds = await targetProfileTrainingOrganizationRepository.getOrganizations(
        targetProfileTraining1.id,
      );

      // then
      expect(organizationIds).to.deep.equal([organization1.id]);
    });
  });
});
