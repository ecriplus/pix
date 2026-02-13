import { CampaignParticipation } from '../../../../../src/quest/domain/models/CampaignParticipation.js';
import {
  OrganizationLearnerParticipationStatuses,
  OrganizationLearnerParticipationTypes,
} from '../../../../../src/quest/domain/models/OrganizationLearnerParticipation.js';
import { usecases } from '../../../../../src/quest/domain/usecases/index.js';
import { Membership } from '../../../../../src/shared/domain/models/Membership.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../test-helper.js';

describe('Integration | Quest | Domain | UseCases | delete-and-anonymise-participations-for-a-learner-id', function () {
  let campaign,
    organization,
    combinedCourse,
    organizationLearnerId,
    otherOrganizationLearnerId,
    campaignParticipationId,
    campaignParticipationsApiStub;
  const moduleId = '01151659-77c1-41cc-8724-89091357af3d';

  beforeEach(async function () {
    campaignParticipationsApiStub = {
      getCampaignParticipationsByLearnerIdAndCampaignId: sinon.stub(),
      deleteCampaignsParticipationsInCombinedCourse: sinon.stub(),
    };

    organization = databaseBuilder.factory.buildOrganization();
    organizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
      organizationId: organization.id,
    }).id;
    otherOrganizationLearnerId = databaseBuilder.factory.buildOrganizationLearner({
      organizationId: organization.id,
    }).id;
    campaign = databaseBuilder.factory.buildCampaign({
      organizationId: organization.id,
    });

    combinedCourse = databaseBuilder.factory.buildCombinedCourse({
      combinedCourseContents: [{ campaignId: campaign.id }, { moduleId }],
      code: 'RANDOM',
    });

    campaignParticipationId = databaseBuilder.factory.buildCampaignParticipation({
      campaignId: campaign.id,
      organizationLearnerId,
    }).id;
    databaseBuilder.factory.buildCampaignParticipation({
      campaignId: campaign.id,
      organizationLearnerId: otherOrganizationLearnerId,
    });

    databaseBuilder.factory.buildOrganizationLearnerParticipation({
      combinedCourseId: combinedCourse.id.toString(),
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      organizationLearnerId,
      status: OrganizationLearnerParticipationStatuses.COMPLETED,
    });

    databaseBuilder.factory.buildOrganizationLearnerParticipation({
      combinedCourseId: combinedCourse.id.toString(),
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      organizationLearnerId,
      status: OrganizationLearnerParticipationStatuses.COMPLETED,
    });

    databaseBuilder.factory.buildOrganizationLearnerParticipation({
      moduleId,
      organizationLearnerId: otherOrganizationLearnerId,
      type: OrganizationLearnerParticipationTypes.COMBINED_COURSE,
      status: OrganizationLearnerParticipationStatuses.COMPLETED,
    });

    await databaseBuilder.commit();
  });

  it('flags organization_learner_participations and campaign_participations linked to combined Course with deletedBy/deletedAt attributes', async function () {
    //given
    const { userId } = databaseBuilder.factory.buildMembership({
      organizationId: organization.id,
      organizationRole: Membership.roles.ADMIN,
    });

    campaignParticipationsApiStub.getCampaignParticipationsByLearnerIdAndCampaignId
      .withArgs({ organizationLearnerId, campaignId: campaign.id })
      .resolves(new CampaignParticipation({ id: campaignParticipationId }));
    campaignParticipationsApiStub.deleteCampaignsParticipationsInCombinedCourse
      .withArgs({ userId, campaignParticipationIds: [campaignParticipationId] })
      .resolves();

    await databaseBuilder.commit();

    //when
    await usecases.deleteAndAnonymizeParticipationsForALearnerId({
      combinedCourseId: combinedCourse.id,
      userId,
      organizationLearnerId,
      campaignParticipationsApi: campaignParticipationsApiStub,
    });

    const deletedCombinedCourseParticipations = await knex('organization_learner_participations').where(
      'organizationLearnerId',
      organizationLearnerId,
    );

    const remainingCombinedCourseParticipations = await knex('organization_learner_participations').where(
      'organizationLearnerId',
      otherOrganizationLearnerId,
    );

    //then
    expect(deletedCombinedCourseParticipations).to.have.lengthOf(2);
    expect(deletedCombinedCourseParticipations[0].deletedBy).to.equal(userId);
    expect(deletedCombinedCourseParticipations[0].deletedAt).to.not.be.null;
    expect(deletedCombinedCourseParticipations[1].deletedBy).to.equal(userId);
    expect(deletedCombinedCourseParticipations[1].deletedAt).to.not.be.null;

    expect(remainingCombinedCourseParticipations.length).to.equal(1);
    expect(remainingCombinedCourseParticipations[0].deletedBy).to.be.null;
    expect(remainingCombinedCourseParticipations[0].deletedAt).to.be.null;
  });
});
