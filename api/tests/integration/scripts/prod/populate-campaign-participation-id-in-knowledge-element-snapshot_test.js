import { PopulateCampaignParticipationIdScript } from '../../../../scripts/prod/populate-campaign-participation-id-in-knowledge-element-snapshot.js';
import { CampaignTypes } from '../../../../src/prescription/shared/domain/constants.js';
import { databaseBuilder, expect, knex, sinon } from '../../../test-helper.js';

describe('Script | Prod | Delete Organization Learners From Organization', function () {
  describe('Options', function () {
    it('has the correct options', function () {
      // when
      const script = new PopulateCampaignParticipationIdScript();
      const { options } = script.metaInfo;

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
    let user, learner, campaign, otherCampaign;

    beforeEach(async function () {
      script = new PopulateCampaignParticipationIdScript();
      logger = { info: sinon.spy(), error: sinon.spy(), debug: sinon.spy() };
      dependencies = { pause: sinon.stub() };

      user = databaseBuilder.factory.buildUser({ id: 123, firstName: 'Sam', lastName: 'Sagace' });
      learner = databaseBuilder.factory.buildOrganizationLearner({
        userId: user.id,
      });

      campaign = databaseBuilder.factory.buildCampaign({ type: CampaignTypes.PROFILES_COLLECTION });
      otherCampaign = databaseBuilder.factory.buildCampaign();
      await databaseBuilder.commit();
    });

    describe('no participation', function () {
      it('should end early if there no participation to update', async function () {
        // when
        await script.handle({ options: { chunkSize: 1, pauseDuration: 0 }, logger, dependencies });

        // then
        expect(logger.info).to.have.been.calledWithExactly(
          { event: 'PopulateCampaignParticipationIdScript' },
          'There is no knowledge-element-snapshot with missing campaignParticipationId. Job done !',
        );
      });
    });

    describe('linked participation', function () {
      beforeEach(async function () {
        // given
        const participation = databaseBuilder.factory.buildCampaignParticipation({
          organizationLearnerId: learner.id,
          userId: user.id,
          campaign: campaign.id,
          participantExternalId: null,
          createdAt: new Date('2024-12-15'),
          sharedAt: new Date('2024-12-16'),
        });
        databaseBuilder.factory.knowledgeElementSnapshotFactory.buildSnapshot({
          id: 1,
          userId: user.id,
          snappedAt: participation.sharedAt,
          knowledgeElementsAttributes: [{ skillId: 'skill_1', status: 'validated', earnedPix: 40 }],
        });
        const otherParticipation = databaseBuilder.factory.buildCampaignParticipation({
          organizationLearnerId: learner.id,
          userId: user.id,
          campaign: otherCampaign.id,
          participantExternalId: null,
          createdAt: new Date('2024-05-09'),
          sharedAt: new Date('2024-05-12'),
        });
        databaseBuilder.factory.knowledgeElementSnapshotFactory.buildSnapshot({
          id: 2,
          userId: user.id,
          snappedAt: otherParticipation.sharedAt,
          knowledgeElementsAttributes: [{ skillId: 'skill_1', status: 'validated', earnedPix: 40 }],
        });
        await databaseBuilder.commit();
      });

      it('log how many entries will be updated', async function () {
        // when
        await script.handle({ options: { chunkSize: 1, pauseDuration: 0 }, logger, dependencies });

        // then
        expect(
          logger.info.calledWithExactly(
            { event: 'PopulateCampaignParticipationIdScript' },
            'Try to populate 2 missing campaignParticipationId',
          ),
        ).to.be.true;
      });

      it('populate empty participations one by one', async function () {
        // when
        await script.handle({ options: { chunkSize: 1, pauseDuration: 0 }, logger, dependencies });

        // then
        const emptyKeSnapshots = await knex('knowledge-element-snapshots')
          .whereNull('campaignParticipationId')
          .count()
          .first();
        expect(emptyKeSnapshots.count).to.equals(0);
        expect(logger.info).to.have.been.calledWith(
          { event: 'PopulateCampaignParticipationIdScript' },
          `2 rows updated from "knowledge-element-snapshots"`,
        );
        expect(logger.info).to.have.been.calledWith(
          { event: 'PopulateCampaignParticipationIdScript' },
          'No row with empty campaignParticipationId to update. Job done !',
        );
      });

      it('populate empty participations using a chunk of 1000', async function () {
        // when
        await script.handle({ options: { chunkSize: 1000, pauseDuration: 0 }, logger, dependencies });

        // then
        const emptyKeSnapshots = await knex('knowledge-element-snapshots')
          .whereNull('campaignParticipationId')
          .count()
          .first();
        expect(emptyKeSnapshots.count).to.equals(0);
        expect(logger.info).to.have.been.calledWith(
          { event: 'PopulateCampaignParticipationIdScript' },
          `2 rows updated from "knowledge-element-snapshots"`,
        );
        expect(dependencies.pause.called).to.be.false;
        expect(logger.info).to.have.been.calledWith(
          { event: 'PopulateCampaignParticipationIdScript' },
          'No row with empty campaignParticipationId to update. Job done !',
        );
      });

      it('should pause between chunk of 1', async function () {
        // given
        dependencies.pause.resolves();

        // when
        await script.handle({ options: { chunkSize: 1, pauseDuration: 10 }, logger, dependencies });
        const emptyKeSnapshots = await knex('knowledge-element-snapshots')
          .whereNull('campaignParticipationId')
          .count()
          .first();

        // then
        expect(emptyKeSnapshots.count).to.equals(0);
        expect(dependencies.pause).to.have.been.calledOnce;
        expect(dependencies.pause).to.have.been.calledWith(10);
      });
    });

    describe('anonymised participations', function () {
      it('should populate matching unique participation and snapshot', async function () {
        // given
        const participation = databaseBuilder.factory.buildCampaignParticipation({
          organizationLearnerId: learner.id,
          userId: null,
          campaign: campaign.id,
          participantExternalId: null,
          createdAt: new Date('2024-12-15'),
          sharedAt: new Date('2014-12-16'),
        });

        databaseBuilder.factory.knowledgeElementSnapshotFactory.buildSnapshot({
          userId: user.id,
          snappedAt: participation.sharedAt,
          knowledgeElementsAttributes: [{ skillId: 'skill_1', status: 'validated', earnedPix: 40 }],
        });
        await databaseBuilder.commit();

        // when
        await script.handle({ options: { chunkSize: 1000, pauseDuration: 0 }, logger, dependencies });

        // then
        const matchingSnapshot = await knex('knowledge-element-snapshots')
          .where('snappedAt', participation.sharedAt)
          .first();
        expect(matchingSnapshot.campaignParticipationId).to.equals(participation.id);
      });

      it('should not populate when matching multiple participations and snapshot', async function () {
        // given
        const participation = databaseBuilder.factory.buildCampaignParticipation({
          organizationLearnerId: learner.id,
          userId: null,
          campaign: campaign.id,
          participantExternalId: null,
          createdAt: new Date('2024-12-15'),
          sharedAt: new Date('2014-12-16'),
        });
        databaseBuilder.factory.buildCampaignParticipation({
          userId: null,
          participantExternalId: null,
          createdAt: new Date('2024-12-15'),
          sharedAt: participation.sharedAt,
        });

        databaseBuilder.factory.knowledgeElementSnapshotFactory.buildSnapshot({
          userId: user.id,
          snappedAt: participation.sharedAt,
          knowledgeElementsAttributes: [{ skillId: 'skill_1', status: 'validated', earnedPix: 40 }],
        });
        await databaseBuilder.commit();

        // when
        await script.handle({ options: { chunkSize: 1000, pauseDuration: 0 }, logger, dependencies });

        //then
        const emptyKeSnapshots = await knex('knowledge-element-snapshots')
          .whereNull('campaignParticipationId')
          .count()
          .first();

        expect(emptyKeSnapshots.count).to.equals(1);
      });
    });
  });
});
