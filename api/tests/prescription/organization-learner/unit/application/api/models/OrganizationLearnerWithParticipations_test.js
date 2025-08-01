import { OrganizationLearnerWithParticipations } from '../../../../../../../src/prescription/organization-learner/application/api/read-models/OrganizationLearnerWithParticipations.js';
import { CampaignParticipationStatuses } from '../../../../../../../src/prescription/shared/domain/constants.js';
import { domainBuilder, expect } from '../../../../../../test-helper.js';

describe('Unit | Application| API | Models | OrganizationLearnerWithParticipations', function () {
  it('should return attributes from user', function () {
    // given
    const tagNames = ['tag1', 'tag2'];
    const organization = domainBuilder.buildOrganization();
    const organizationLearner = domainBuilder.buildOrganizationLearner();
    const participationsList = [
      domainBuilder.buildCampaignParticipationOverview({
        id: 123,
        targetProfileId: 321,
        status: CampaignParticipationStatuses.SHARED,
        campaignName: 'Mon nom 1',
      }),
      domainBuilder.buildCampaignParticipationOverview({
        id: 456,
        targetProfileId: 654,
        status: CampaignParticipationStatuses.TO_SHARE,
        campaignName: 'Mon nom 2',
      }),
    ];

    // when
    const organizationLearnerWithParticipations = new OrganizationLearnerWithParticipations({
      organizationLearner,
      organization,
      campaignParticipations: participationsList,
      tagNames,
    });

    // then
    expect(organizationLearnerWithParticipations).to.have.keys(
      'organizationLearner',
      'organization',
      'campaignParticipations',
    );
    expect(organizationLearnerWithParticipations.organizationLearner).to.deep.equal({
      id: organizationLearner.id,
    });
    expect(organizationLearnerWithParticipations.organization).to.deep.equal({
      id: organization.id,
      isManagingStudents: organization.isManagingStudents,
      tags: tagNames,
      type: organization.type,
    });
    expect(organizationLearnerWithParticipations.campaignParticipations).to.deep.have.members([
      {
        targetProfileId: 321,
        id: 123,
        status: CampaignParticipationStatuses.SHARED,
        campaignName: 'Mon nom 1',
      },
      {
        targetProfileId: 654,
        id: 456,
        status: CampaignParticipationStatuses.TO_SHARE,
        campaignName: 'Mon nom 2',
      },
    ]);
  });
});
