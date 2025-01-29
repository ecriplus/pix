import {
  createServer,
  databaseBuilder,
  expect,
  generateAuthenticatedUserRequestHeaders,
} from '../../../test-helper.js';

describe('Profile | Acceptance | Application | Share Profile Route ', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  describe('POST /api/users/{userId}/profile/share-reward', function () {
    describe('when profile reward exists and is linked to user', function () {
      it('should return a success code', async function () {
        // given
        const userId = databaseBuilder.factory.buildUser().id;
        const profileReward = databaseBuilder.factory.buildProfileReward({ userId });
        const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation();

        await databaseBuilder.commit();
        const options = {
          method: 'POST',
          headers: generateAuthenticatedUserRequestHeaders({ userId }),
          url: `/api/users/${userId}/profile/share-reward`,
          payload: {
            data: {
              attributes: {
                profileRewardId: profileReward.id,
                campaignParticipationId: campaignParticipation.id,
              },
            },
          },
        };

        // when
        const response = await server.inject(options);

        // then
        expect(response.statusCode).to.equal(201);
      });
    });
  });

  describe('when profile reward is not linked to user', function () {
    it('should return a 412 code', async function () {
      // given
      const userId = databaseBuilder.factory.buildUser().id;
      const profileReward = databaseBuilder.factory.buildProfileReward();
      const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation();

      await databaseBuilder.commit();
      const options = {
        method: 'POST',
        headers: generateAuthenticatedUserRequestHeaders({ userId }),
        url: `/api/users/${userId}/profile/share-reward`,
        payload: {
          data: {
            attributes: {
              profileRewardId: profileReward.id,
              campaignParticipationId: campaignParticipation.id,
            },
          },
        },
      };

      // when
      const response = await server.inject(options);

      // then
      expect(response.statusCode).to.equal(412);
    });
  });
});
