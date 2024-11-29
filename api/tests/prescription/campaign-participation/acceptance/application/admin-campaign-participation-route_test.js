import { Assessment } from '../../../../../src/shared/domain/models/Assessment.js';
import {
  createServer,
  databaseBuilder,
  expect,
  generateValidRequestAuthorizationHeader,
} from '../../../../test-helper.js';

describe('Acceptance | Controller | GET /api/admin/users/{userId}/participations', function () {
  let server;

  beforeEach(async function () {
    server = await createServer();
  });

  it('should return participations', async function () {
    // given
    const user = databaseBuilder.factory.buildUser();
    const campaign = databaseBuilder.factory.buildCampaign();
    const organizationLearner = databaseBuilder.factory.buildOrganizationLearner();
    const campaignParticipation = databaseBuilder.factory.buildCampaignParticipation({
      userId: user.id,
      campaignId: campaign.id,
      organizationLearnerId: organizationLearner.id,
    });
    const assessment = databaseBuilder.factory.buildAssessment({
      userId: user.id,
      campaignParticipationId: campaignParticipation.id,
      type: Assessment.types.CAMPAIGN,
    });
    const admin = databaseBuilder.factory.buildUser.withRole();
    await databaseBuilder.commit();

    // when
    const response = await server.inject({
      method: 'GET',
      url: `/api/admin/users/${user.id}/participations`,
      headers: { authorization: generateValidRequestAuthorizationHeader(admin.id) },
    });

    // then
    expect(response.statusCode).to.equal(200);
    expect(response.result).to.deep.equal({
      data: [
        {
          id: assessment.id.toString(),
          type: 'user-participations',
          attributes: {
            'campaign-participation-id': campaignParticipation.id,
            'campaign-code': campaign.code,
            'campaign-id': campaign.id,
            'created-at': campaignParticipation.createdAt,
            'deleted-at': null,
            'participant-external-id': campaignParticipation.participantExternalId,
            'shared-at': campaignParticipation.sharedAt,
            status: campaignParticipation.status,
            'organization-learner-full-name': `${organizationLearner.firstName} ${organizationLearner.lastName}`,
          },
        },
      ],
    });
  });
});
