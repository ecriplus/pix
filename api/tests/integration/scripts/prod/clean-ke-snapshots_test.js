import { CleanKeSnapshotScript } from '../../../../scripts/prod/clean-ke-snapshots.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Script | Prod | Clean knowledge-element-snapshot snapshot (jsonb)', function () {
  describe('Options', function () {
    it('has the correct options', function () {
      // when
      const script = new CleanKeSnapshotScript();
      const { options, description, permanent } = script.metaInfo;
      expect(permanent).to.be.false;
      expect(description).to.equal(
        'This script will remove unused properties from the column knowledge-element-snapshots.snapshot',
      );
      // then
      expect(options.chunkSize).to.deep.include({
        type: 'number',
        default: 10000,
        description: 'number of records to update in one update',
      });
      expect(options.pauseDuration).to.deep.include({
        type: 'number',
        default: 2000,
        description: 'Time in ms between each chunk processing',
      });
    });
  });

  describe('Handle', function () {
    let script;
    let logger;
    let dependencies;
    let user, campaign, learner;
    let firstSnapshotId, secondSnapshotId, thirdSnapshotId;

    beforeEach(async function () {
      script = new CleanKeSnapshotScript();
      logger = { info: sinon.spy(), error: sinon.spy(), debug: sinon.spy() };
      dependencies = { pause: sinon.stub() };

      campaign = databaseBuilder.factory.buildCampaign();
      user = databaseBuilder.factory.buildUser();
      learner = databaseBuilder.factory.buildOrganizationLearner({
        userId: user.id,
      });
      const participation = databaseBuilder.factory.buildCampaignParticipation({
        organizationLearnerId: learner.id,
        userId: user.id,
        campaign: campaign.id,
        participantExternalId: null,
        sharedAt: new Date('2025-01-01'),
      });
      const participation2 = databaseBuilder.factory.buildCampaignParticipation({
        organizationLearnerId: learner.id,
        userId: user.id,
        campaign: campaign.id,
        participantExternalId: null,
        sharedAt: new Date('2025-01-02'),
      });
      const participation3 = databaseBuilder.factory.buildCampaignParticipation({
        organizationLearnerId: learner.id,
        userId: user.id,
        campaign: campaign.id,
        participantExternalId: null,
        sharedAt: new Date('2025-01-03'),
      });

      const assessmentId = databaseBuilder.factory.buildAssessment({
        userId: user.id,
        campaignParticipationId: participation.id,
      }).id;
      const answerId = databaseBuilder.factory.buildAnswer({ assessmentId }).id;
      firstSnapshotId = 1;
      secondSnapshotId = 2;
      thirdSnapshotId = 3;
      databaseBuilder.factory.knowledgeElementSnapshotFactory.buildSnapshot({
        id: firstSnapshotId,
        knowledgeElementsAttributes: [
          { skillId: 'skill_1', status: 'validated', earnedPix: 40, userId: user.id, answerId },
        ],
        campaignParticipationId: participation.id,
      });
      databaseBuilder.factory.knowledgeElementSnapshotFactory.buildSnapshot({
        id: secondSnapshotId,
        knowledgeElementsAttributes: [{ skillId: 'skill_2', status: 'validated', earnedPix: 40, userId: user.id }],
        campaignParticipationId: participation2.id,
      });
      databaseBuilder.factory.knowledgeElementSnapshotFactory.buildSnapshot({
        id: thirdSnapshotId,
        knowledgeElementsAttributes: [
          {
            id: 456,
            skillId: 'skill_2',
            status: 'validated',
            earnedPix: 40,
            userId: null,
            assessmentId: null,
            answerId: null,
          },
        ],
        campaignParticipationId: participation3.id,
      });

      await databaseBuilder.commit();
    });

    it('should clean snapshot one by one', async function () {
      // given
      const options = { chunkSize: 1, pauseDuration: 0 };

      // when
      await script.handle({ options, logger, dependencies });

      // then
      const snapshots = await knex('knowledge-element-snapshots').pluck('snapshot');

      expect(snapshots.flat().every(({ userId, assessmentId }) => !userId && !assessmentId)).to.be.true;
      expect(logger.info).to.have.been.calledWithExactly({ event: 'CleanKeSnapshotScript' }, '1 chunks done !');
      expect(logger.info).to.have.been.calledWithExactly({ event: 'CleanKeSnapshotScript' }, '2 chunks done !');
    });

    it('should pause between chunks', async function () {
      // given
      const options = { chunkSize: 1, pauseDuration: 10 };

      // when
      await script.handle({ options, logger, dependencies });

      // then
      expect(dependencies.pause).to.have.been.calledOnceWithExactly(10);
    });

    it('should remove userId, answerId and assessmentId from snapshots when answerId is in snapshot', async function () {
      // given

      // when
      await script.handle({ logger, dependencies });

      // then
      const snapshots = await knex('knowledge-element-snapshots');

      const firstSnapshot = snapshots.find((snapshot) => snapshot.id === firstSnapshotId);
      const secondSnapshot = snapshots.find((snapshot) => snapshot.id === secondSnapshotId);

      expect(firstSnapshot.snapshot).to.deep.equal([
        {
          source: 'direct',
          status: 'validated',
          skillId: 'skill_1',
          createdAt: '2020-01-01T00:00:00.000Z',
          earnedPix: 40,
          competenceId: 'recCHA789',
        },
      ]);
      expect(secondSnapshot.snapshot).to.deep.equal([
        {
          source: 'direct',
          status: 'validated',
          skillId: 'skill_2',
          createdAt: '2020-01-01T00:00:00.000Z',
          earnedPix: 40,
          competenceId: 'recCHA789',
        },
      ]);
    });

    it('should not update snapshot without answerId', async function () {
      // given
      // We just verify that we dont want to touch at others snapshot without answerId
      // when
      await script.handle({ logger, dependencies });

      // then
      const snapshots = await knex('knowledge-element-snapshots');

      const thirdSnapshot = snapshots.find((snapshot) => snapshot.id === thirdSnapshotId);

      expect(thirdSnapshot.snapshot).to.deep.equal([
        {
          id: 456,
          source: 'direct',
          status: 'validated',
          skillId: 'skill_2',
          createdAt: '2020-01-01T00:00:00.000Z',
          earnedPix: 40,
          competenceId: 'recCHA789',
          userId: null,
          answerId: null,
          assessmentId: null,
        },
      ]);
    });
  });
});
