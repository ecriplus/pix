import { profileController } from '../../../../src/profile/application/profile-controller.js';
import { usecases } from '../../../../src/profile/domain/usecases/index.js';
import * as requestResponseUtils from '../../../../src/shared/infrastructure/utils/request-response-utils.js';
import { expect, hFake, sinon } from '../../../test-helper.js';

describe('Profile | Unit | Controller | profile-controller', function () {
  describe('#getProfile', function () {
    beforeEach(function () {
      sinon.stub(usecases, 'getUserProfile').resolves({
        pixScore: 3,
        scorecards: [],
      });
    });

    it('should call the expected usecase', async function () {
      // given
      const profileSerializer = { serialize: sinon.stub() };
      profileSerializer.serialize.resolves();
      const userId = '12';
      const locale = 'fr';

      const request = {
        auth: {
          credentials: {
            userId,
          },
        },
        params: {
          id: userId,
        },
        headers: { 'accept-language': locale },
      };

      // when
      await profileController.getProfile(request, hFake, { profileSerializer, requestResponseUtils });

      // then
      expect(usecases.getUserProfile).to.have.been.calledWithExactly({ userId, locale });
    });
  });

  describe('#shareProfileReward', function () {
    beforeEach(function () {
      sinon.stub(usecases, 'shareProfileReward').resolves();
    });

    it('should call the expected usecase', async function () {
      // given
      const profileRewardId = '11';
      const campaignParticipationId = '22';
      const userId = '33';

      const request = {
        auth: {
          credentials: {
            userId,
          },
        },
        params: {
          userId,
        },
        payload: {
          data: {
            attributes: {
              profileRewardId,
              campaignParticipationId,
            },
          },
        },
      };

      // when
      await profileController.shareProfileReward(request, hFake);

      // then
      expect(usecases.shareProfileReward).to.have.been.calledWithExactly({
        userId,
        profileRewardId,
        campaignParticipationId,
      });
    });
  });
});
