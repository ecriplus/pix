import { RecommendedModule } from '../../../../../src/devcomp/application/api/models/RecommendedModule.js';
import * as recommendedModulesApi from '../../../../../src/devcomp/application/api/recommended-modules-api.js';
import { DomainError } from '../../../../../src/shared/domain/errors.js';
import { catchErr, databaseBuilder, expect } from '../../../../test-helper.js';

describe('Integration | Devcomp | Application | Api | RecommendedModules', function () {
  describe('#findByCampaignParticipationIds', function () {
    it('should return a list recommended modules', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({ userId }).id;
      const trainingId = databaseBuilder.factory.buildTraining({
        type: 'modulix',
        link: '/modules/adresse-ip-publique-et-vous/details',
      }).id;
      databaseBuilder.factory.buildUserRecommendedTraining({
        userId,
        campaignParticipationId,
        trainingId,
      });

      await databaseBuilder.commit();

      // when
      const result = await recommendedModulesApi.findByCampaignParticipationIds({
        campaignParticipationIds: [campaignParticipationId],
      });

      // then
      const expectedResult = [
        new RecommendedModule({ id: trainingId, moduleId: '5df14039-803b-4db4-9778-67e4b84afbbd' }),
      ];

      expect(result).to.deep.equal(expectedResult);
    });

    context('if campaignParticipationIds is empty', function () {
      it('should throw a DomainError error', async function () {
        // given & when
        const error = await catchErr(recommendedModulesApi.findByCampaignParticipationIds)({
          campaignParticipationIds: [],
        });

        // then
        expect(error).to.be.instanceOf(DomainError);
        expect(error.message).to.equal('campaignParticipationIds can not be empty');
      });
    });
  });
});
