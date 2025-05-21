import { usecases } from '../../../../../../src/prescription/learner-management/domain/usecases/index.js';
import { databaseBuilder, expect, knex, sinon } from '../../../../../test-helper.js';

describe('Integration | UseCase | Organization Learners Management | Delete Organization Learners', function () {
  let organizationId;
  let organizationLearner1, organizationLearner2;
  const participantExternalId = 'foo';
  let userId;
  let now, clock;

  beforeEach(async function () {
    userId = databaseBuilder.factory.buildUser().id;
    organizationId = databaseBuilder.factory.buildOrganization().id;
    organizationLearner1 = databaseBuilder.factory.buildOrganizationLearner({ organizationId });
    organizationLearner2 = databaseBuilder.factory.buildOrganizationLearner({ organizationId });
    databaseBuilder.factory.buildCampaignParticipation({
      organizationLearnerId: organizationLearner1.id,
      participantExternalId,
      userId: organizationLearner1.userId,
    });
    await databaseBuilder.commit();

    now = new Date();
    clock = sinon.useFakeTimers(now, 'Date');
  });

  afterEach(async function () {
    clock.restore();
  });

  it('should delete organization learners and their participations', async function () {
    // when
    await usecases.deleteOrganizationLearners({
      organizationLearnerIds: [organizationLearner1.id, organizationLearner2.id],
      organizationId,
      userId,
    });

    // then
    const organizationLearners = await knex('organization-learners')
      .select('id', 'deletedBy', 'deletedAt', 'userId')
      .where('organizationId', organizationId);
    expect(organizationLearners.length).to.equal(2);
    expect(organizationLearners).to.have.deep.members([
      {
        id: organizationLearner1.id,
        userId: organizationLearner1.userId,
        deletedAt: now,
        deletedBy: userId,
      },
      {
        id: organizationLearner2.id,
        userId: organizationLearner2.userId,
        deletedAt: now,
        deletedBy: userId,
      },
    ]);

    const campaignParticipations = await knex('campaign-participations')
      .select('userId', 'participantExternalId', 'deletedAt', 'deletedBy')
      .where({
        organizationLearnerId: organizationLearner1.id,
      });
    expect(campaignParticipations).to.deep.equal([
      {
        userId: organizationLearner1.userId,
        participantExternalId,
        deletedAt: now,
        deletedBy: userId,
      },
    ]);
  });
});
