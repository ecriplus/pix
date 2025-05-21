import { OrganizationLearnerList } from '../../../../../../src/prescription/learner-management/domain/models/OrganizationLearnerList.js';
import { deleteOrganizationLearners } from '../../../../../../src/prescription/learner-management/domain/usecases/delete-organization-learners.js';
import { expect, sinon } from '../../../../../test-helper.js';

describe('Unit | UseCase | Organization Learners Management | Delete Organization Learners', function () {
  let campaignParticipationRepository;
  let organizationLearnerRepository;
  let organizationLearnerIds;
  let organizationId;
  let userId;
  let getDeletableOrganizationLearnersStub;

  beforeEach(function () {
    userId = 777;
    organizationId = 123;
    organizationLearnerIds = [123, 456, 789];
    getDeletableOrganizationLearnersStub = sinon.stub(
      OrganizationLearnerList.prototype,
      'getDeletableOrganizationLearners',
    );
    campaignParticipationRepository = {
      removeByOrganizationLearnerIds: sinon.stub(),
    };
    organizationLearnerRepository = {
      removeByIds: sinon.stub(),
      findOrganizationLearnersByOrganizationId: sinon.stub().returns(organizationLearnerIds),
    };
    organizationLearnerRepository.findOrganizationLearnersByOrganizationId.resolves(organizationLearnerIds);
  });

  it('should delete organization learners and their participations when all learners belong to organization', async function () {
    // given
    getDeletableOrganizationLearnersStub.withArgs(organizationLearnerIds).returns(organizationLearnerIds);

    // when
    await deleteOrganizationLearners({
      organizationLearnerIds,
      userId,
      organizationId,
      campaignParticipationRepository,
      organizationLearnerRepository,
    });

    expect(getDeletableOrganizationLearnersStub).to.have.been.calledWith(organizationLearnerIds);

    expect(organizationLearnerRepository.findOrganizationLearnersByOrganizationId).to.have.been.calledWithExactly({
      organizationId,
    });

    // then
    expect(campaignParticipationRepository.removeByOrganizationLearnerIds).to.have.been.calledWithExactly({
      organizationLearnerIds,
      userId,
    });

    expect(organizationLearnerRepository.removeByIds).to.have.been.calledWithExactly({
      organizationLearnerIds,
      userId,
    });
  });

  it('should not delete organization learners and participations of learners which do not belong to the organization', async function () {
    // given
    const organizationLearnerIdsPayload = [123, 456, 789, 101];
    getDeletableOrganizationLearnersStub.withArgs(organizationLearnerIdsPayload).returns(organizationLearnerIds);

    // when
    await deleteOrganizationLearners({
      organizationLearnerIds: organizationLearnerIdsPayload,
      userId,
      organizationId,
      campaignParticipationRepository,
      organizationLearnerRepository,
    });

    expect(getDeletableOrganizationLearnersStub).to.have.been.calledWith(organizationLearnerIdsPayload);

    expect(organizationLearnerRepository.findOrganizationLearnersByOrganizationId).to.have.been.calledWithExactly({
      organizationId,
    });

    expect(campaignParticipationRepository.removeByOrganizationLearnerIds).to.have.been.calledWithExactly({
      organizationLearnerIds,
      userId,
    });

    expect(organizationLearnerRepository.removeByIds).to.have.been.calledWithExactly({
      organizationLearnerIds,
      userId,
    });
  });
});
