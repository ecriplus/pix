const { expect, databaseBuilder, knex, mockLearningContent, learningContentBuilder } = require('../../../test-helper');
const campaignAssessmentParticipationResultListRepository = require('../../../../lib/infrastructure/repositories/campaign-assessment-participation-result-list-repository');
const CampaignParticipation = require('../../../../lib/domain/models/CampaignParticipation');

const { STARTED } = CampaignParticipation.statuses;

describe('Integration | Repository | Campaign Assessment Participation Result List', function () {
  describe('#findPaginatedByCampaignId', function () {
    afterEach(function () {
      return knex('knowledge-element-snapshots').delete();
    });

    let campaign;

    context('when participants have not retried', function () {
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        databaseBuilder.factory.buildAssessmentFromParticipation(
          {
            participantExternalId: 'The good',
            campaignId: campaign.id,
          },
          {
            firstName: 'John',
            lastName: 'Doe',
          }
        );

        databaseBuilder.factory.buildAssessmentFromParticipation({
          participantExternalId: 'The bad',
          campaignId: campaign.id,
          status: STARTED,
        });

        databaseBuilder.factory.buildAssessmentFromParticipation({
          participantExternalId: 'The ugly',
        });

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      it('returns the list of participations shared for the given campaign', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations).to.have.lengthOf(1);
        expect(participations[0]).to.include({
          firstName: 'John',
          lastName: 'Doe',
          participantExternalId: 'The good',
        });
      });
    });

    context('when a participant has retried', function () {
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);
        const { id: userId } = databaseBuilder.factory.buildUser();

        databaseBuilder.factory.buildCampaignParticipation({
          participantExternalId: 'My first',
          campaignId: campaign.id,
          isImproved: true,
          userId,
        });

        databaseBuilder.factory.buildCampaignParticipation({
          participantExternalId: 'My last',
          campaignId: campaign.id,
          isImproved: false,
          userId,
        });

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      it('returns the list of participations shared for the given campaign', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations).to.have.lengthOf(1);
        expect(participations[0].participantExternalId).to.equal('My last');
      });
    });

    context('when there is a schooling registration', function () {
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        const { userId } = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
        });

        databaseBuilder.factory.buildSchoolingRegistration({
          firstName: 'Joe',
          lastName: 'Le taxi',
          organizationId: campaign.organizationId,
          userId,
        });

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      it('returns the name from the schooling registration', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations).to.have.lengthOf(1);
        expect(participations[0]).to.include({
          firstName: 'Joe',
          lastName: 'Le taxi',
        });
      });
    });

    context('when there are no schooling registrations', function () {
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);
        const { id: userId } = databaseBuilder.factory.buildUser({
          firstName: 'Jane',
          lastName: 'Le uber',
        });
        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
        });

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      it('returns the name from the schooling registration', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations).to.have.lengthOf(1);
        expect(participations[0]).to.include({
          firstName: 'Jane',
          lastName: 'Le uber',
        });
      });
    });

    context('when there are badges acquired', function () {
      let badge1Id, badge2Id;
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);
        const { id: userId } = databaseBuilder.factory.buildUser({
          firstName: 'Jane',
          lastName: 'Le uber',
        });
        const { id: campaignParticipationId } = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
        });
        badge1Id = databaseBuilder.factory.buildBadge({
          key: 'Badge1',
          targetProfileId: campaign.targetProfileId,
          title: 'BadgeTitle',
          altMessage: 'BadgeMessage',
          imageUrl: 'BadgeImageUrl',
        }).id;
        badge2Id = databaseBuilder.factory.buildBadge({ key: 'Badge2' }).id;

        databaseBuilder.factory.buildBadgeAcquisition({ userId, badgeId: badge1Id, campaignParticipationId });
        databaseBuilder.factory.buildBadgeAcquisition({ userId, badgeId: badge2Id });
        await databaseBuilder.commit();
        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      it('returns acquired badges during the campaign', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations[0].badges).to.deep.equal([
          {
            id: badge1Id,
            title: 'BadgeTitle',
            altMessage: 'BadgeMessage',
            imageUrl: 'BadgeImageUrl',
          },
        ]);
      });
    });

    context('masteryRate', function () {
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [
          { id: 'Skill1' },
          { id: 'Skill2' },
          { id: 'Skill3' },
        ]);

        const { id: userId } = databaseBuilder.factory.buildUser({});

        databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId,
          masteryRate: 0.33,
        });

        await databaseBuilder.commit();
        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1' }, { id: 'Skill2' }, { id: 'Skill3' }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      it('computes the mastery percentage', async function () {
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });

        expect(participations[0].masteryRate).to.equal(0.33);
      });
    });

    context('order', function () {
      it('should return participants data summary ordered by last name then first name asc (including schooling registration data)', async function () {
        // given
        const organizationId = databaseBuilder.factory.buildOrganization().id;
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({ organizationId }, [{ id: 'Skill1' }]);
        const campaignParticipation = { campaignId: campaign.id };
        databaseBuilder.factory.buildCampaignParticipationWithSchoolingRegistration(
          { firstName: 'Jaja', lastName: 'Le raplapla', organizationId },
          campaignParticipation,
          true
        );
        databaseBuilder.factory.buildCampaignParticipationWithUser(
          { firstName: 'Jiji', lastName: 'Le riquiqui', organizationId },
          campaignParticipation,
          true
        );
        databaseBuilder.factory.buildCampaignParticipationWithUser(
          { firstName: 'Jojo', lastName: 'le rococo', organizationId },
          campaignParticipation,
          true
        );
        databaseBuilder.factory.buildCampaignParticipationWithSchoolingRegistration(
          { firstName: 'juju', lastName: 'Le riquiqui', organizationId },
          campaignParticipation,
          true
        );

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
        });
        const names = participations.map((result) => result.firstName);

        // then
        expect(names).exactlyContainInOrder(['Jaja', 'Jiji', 'juju', 'Jojo']);
      });
    });

    context('pagination', function () {
      beforeEach(async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        const participation = {
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation, {});
        databaseBuilder.factory.buildAssessmentFromParticipation(participation, {});

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });

      it('should return paginated campaign participations based on the given size and number', async function () {
        const page = { size: 1, number: 1 };

        const { participations, pagination } =
          await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
            campaignId: campaign.id,
            page,
          });
        const participantExternalIds = participations.map((summary) => summary.participantExternalId);

        expect(participantExternalIds).to.have.lengthOf(1);
        expect(pagination).to.deep.equals({ page: 1, pageCount: 2, pageSize: 1, rowCount: 2 });
      });

      context('default pagination', function () {
        beforeEach(async function () {
          campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

          const participation = {
            campaignId: campaign.id,
          };

          for (let i = 0; i < 11; i++) {
            databaseBuilder.factory.buildAssessmentFromParticipation(participation, {});
          }

          await databaseBuilder.commit();
        });

        it('should return the first page with 10 elements', async function () {
          const { participations, pagination } =
            await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
              campaignId: campaign.id,
            });
          const participantExternalIds = participations.map((summary) => summary.participantExternalId);

          expect(participantExternalIds).to.have.lengthOf(10);
          expect(pagination).to.deep.equals({ page: 1, pageCount: 2, pageSize: 10, rowCount: 11 });
        });
      });

      context('when there are zero rows', function () {
        beforeEach(async function () {
          campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

          await databaseBuilder.commit();
        });

        it('should return the first page with O elements', async function () {
          const { participations, pagination } =
            await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
              campaignId: campaign.id,
            });
          const participantExternalIds = participations.map((summary) => summary.participantExternalId);

          expect(participantExternalIds).to.have.lengthOf(0);
          expect(pagination).to.deep.equals({ page: 1, pageCount: 0, pageSize: 10, rowCount: 0 });
        });
      });
    });

    context('when there is a filter on division', function () {
      it('returns participants which have the correct division', async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        const participation1 = {
          participantExternalId: 'The good',
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation1, { id: 1 });
        databaseBuilder.factory.buildSchoolingRegistration({
          organizationId: campaign.organizationId,
          userId: 1,
          division: 'Good Guys Team',
        });

        const participation2 = {
          participantExternalId: 'The bad',
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation2, { id: 2 });
        databaseBuilder.factory.buildSchoolingRegistration({
          organizationId: campaign.organizationId,
          userId: 2,
          division: 'Bad Guys Team',
        });

        const participation3 = {
          participantExternalId: 'The ugly',
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation3, { id: 3 });
        databaseBuilder.factory.buildSchoolingRegistration({
          organizationId: campaign.organizationId,
          userId: 3,
          division: 'Ugly Guys Team',
        });

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { divisions: ['Good Guys Team', 'Ugly Guys Team'] },
        });

        const participantExternalIds = participations.map((result) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good', 'The ugly']);
      });
    });

    context('when there is a filter on badges', function () {
      let badge1;
      let badge2;
      let user1;
      let user2;

      beforeEach(function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);
        badge1 = databaseBuilder.factory.buildBadge({ key: 'badge1', targetProfileId: campaign.targetProfileId });
        badge2 = databaseBuilder.factory.buildBadge({ key: 'badge2', targetProfileId: campaign.targetProfileId });
        user1 = databaseBuilder.factory.buildUser();
        user2 = databaseBuilder.factory.buildUser();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });
      it('returns participants which have one badge', async function () {
        const campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user1.id,
          participantExternalId: 'The good',
        });
        databaseBuilder.factory.buildAssessment({
          userId: user1.id,
          campaignParticipationId: campaignParticipation1.id,
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge1.id,
          userId: user1.id,
          campaignParticipationId: campaignParticipation1.id,
        });

        const campaignParticipation2 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user2.id,
          participantExternalId: 'The bad',
        });
        databaseBuilder.factory.buildAssessment({
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge2.id,
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });
        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { badges: [badge1.id] },
        });

        const participantExternalIds = participations.map((result) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good']);
      });

      it('returns participants which have several badges', async function () {
        const campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user1.id,
          participantExternalId: 'The good',
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge1.id,
          userId: user1.id,
          campaignParticipationId: campaignParticipation1.id,
        });

        const campaignParticipation2 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user2.id,
          participantExternalId: 'The bad',
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge1.id,
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge2.id,
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });

        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { badges: [badge1.id, badge2.id] },
        });

        const participantExternalIds = participations.map((result) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The bad']);
      });

      it('should not return participants which has not shared but has the badge', async function () {
        const campaignParticipation1 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user1.id,
          participantExternalId: 'The good',
        });
        databaseBuilder.factory.buildAssessment({
          userId: user1.id,
          campaignParticipationId: campaignParticipation1.id,
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge1.id,
          userId: user1.id,
          campaignParticipationId: campaignParticipation1.id,
        });

        const campaignParticipation2 = databaseBuilder.factory.buildCampaignParticipation({
          campaignId: campaign.id,
          userId: user2.id,
          participantExternalId: 'The bad',
          status: STARTED,
        });
        databaseBuilder.factory.buildAssessment({
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });
        databaseBuilder.factory.buildBadgeAcquisition({
          badgeId: badge1.id,
          userId: user2.id,
          campaignParticipationId: campaignParticipation2.id,
        });
        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { badges: [badge1.id] },
        });

        const participantExternalIds = participations.map((result) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good']);
      });
    });

    context('when there is a filter on stage', function () {
      beforeEach(function () {
        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1' }, { id: 'Skill2' }, { id: 'Skill3' }, { id: 'Skill4' }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);
      });
      it('returns participants which have the given stage', async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [
          { id: 'Skill1' },
          { id: 'Skill2' },
          { id: 'Skill3' },
          { id: 'Skill4' },
        ]);
        databaseBuilder.factory.buildStage({ targetProfileId: campaign.targetProfileId, threshold: 0 });
        const { id: stageId } = databaseBuilder.factory.buildStage({
          targetProfileId: campaign.targetProfileId,
          threshold: 25,
        });
        databaseBuilder.factory.buildStage({ targetProfileId: campaign.targetProfileId, threshold: 75 });
        databaseBuilder.factory.buildAssessmentFromParticipation(
          { masteryRate: 0, participantExternalId: 'Juste Before', campaignId: campaign.id },
          { id: 1 }
        );
        databaseBuilder.factory.buildAssessmentFromParticipation(
          { masteryRate: 0.25, participantExternalId: 'Stage Reached Boundary IN', campaignId: campaign.id },
          { id: 2 }
        );
        databaseBuilder.factory.buildAssessmentFromParticipation(
          { masteryRate: 0.74, participantExternalId: 'Stage Reached Boundary OUT', campaignId: campaign.id },
          { id: 3 }
        );
        databaseBuilder.factory.buildAssessmentFromParticipation(
          { masteryRate: 0.75, participantExternalId: 'Just After', campaignId: campaign.id },
          { id: 4 }
        );
        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { stages: [stageId] },
        });

        const participantExternalIds = participations.map((result) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['Stage Reached Boundary IN', 'Stage Reached Boundary OUT']);
      });

      it('returns participants which have validated skill count between several boundaries', async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [
          { id: 'Skill1' },
          { id: 'Skill2' },
          { id: 'Skill3' },
        ]);

        const { id: stage1Id } = databaseBuilder.factory.buildStage({
          targetProfileId: campaign.targetProfileId,
          threshold: 0,
        });
        const { id: stage2Id } = databaseBuilder.factory.buildStage({
          targetProfileId: campaign.targetProfileId,
          threshold: 33,
        });
        databaseBuilder.factory.buildStage({ targetProfileId: campaign.targetProfileId, threshold: 66 });
        databaseBuilder.factory.buildAssessmentFromParticipation({
          masteryRate: 0,
          participantExternalId: 'The good',
          campaignId: campaign.id,
        });
        databaseBuilder.factory.buildAssessmentFromParticipation({
          masteryRate: 0.33,
          participantExternalId: 'The bad',
          campaignId: campaign.id,
        });
        databaseBuilder.factory.buildAssessmentFromParticipation({
          masteryRate: 0.66,
          participantExternalId: 'The ugly',
          campaignId: campaign.id,
        });
        await databaseBuilder.commit();

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { stages: [stage1Id, stage2Id] },
        });

        const participantExternalIds = participations.map((result) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['The good', 'The bad']);
      });
    });

    context('when there is a filter on groups', function () {
      it('returns participants which have the correct groups', async function () {
        campaign = databaseBuilder.factory.buildAssessmentCampaignForSkills({}, [{ id: 'Skill1' }]);

        const participation1 = {
          participantExternalId: 'Sans',
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation1, { id: 1 });
        databaseBuilder.factory.buildSchoolingRegistration({
          organizationId: campaign.organizationId,
          userId: 1,
          group: 'Bad Puns Team',
        });

        const participation2 = {
          participantExternalId: 'Papyrus',
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation2, { id: 2 });
        databaseBuilder.factory.buildSchoolingRegistration({
          organizationId: campaign.organizationId,
          userId: 2,
          group: 'Royal Guard',
        });

        const participation3 = {
          participantExternalId: 'Asriel',
          campaignId: campaign.id,
        };

        databaseBuilder.factory.buildAssessmentFromParticipation(participation3, { id: 3 });
        databaseBuilder.factory.buildSchoolingRegistration({
          organizationId: campaign.organizationId,
          userId: 3,
          group: 'Adoptive Brother',
        });

        await databaseBuilder.commit();

        const learningContent = [
          {
            id: 'recArea1',
            competences: [
              {
                id: 'recCompetence1',
                tubes: [
                  {
                    id: 'recTube1',
                    skills: [{ id: 'Skill1', name: '@Acquis1', challenges: [] }],
                  },
                ],
              },
            ],
          },
        ];
        const learningContentObjects = learningContentBuilder.buildLearningContent(learningContent);
        mockLearningContent(learningContentObjects);

        // when
        const { participations } = await campaignAssessmentParticipationResultListRepository.findPaginatedByCampaignId({
          campaignId: campaign.id,
          filters: { groups: ['Royal Guard', 'Bad Puns Team'] },
        });

        const participantExternalIds = participations.map((result) => result.participantExternalId);

        // then
        expect(participantExternalIds).to.exactlyContain(['Sans', 'Papyrus']);
      });
    });
  });
});
