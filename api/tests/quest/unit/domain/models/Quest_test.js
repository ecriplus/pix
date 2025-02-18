import { Eligibility } from '../../../../../src/quest/domain/models/Eligibility.js';
import {
  CRITERION_COMPARISONS,
  Quest,
  REQUIREMENT_COMPARISONS,
  REQUIREMENT_TYPES,
} from '../../../../../src/quest/domain/models/Quest.js';
import { Success } from '../../../../../src/quest/domain/models/Success.js';
import { KnowledgeElement } from '../../../../../src/shared/domain/models/index.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | Quest ', function () {
  describe('#isEligible', function () {
    it('return true', function () {
      const quest = new Quest({
        eligibilityRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.ORGANIZATION,
            data: {
              type: {
                data: 'SCO',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
        ],
        successRequirements: [],
      });

      const eligibility = new Eligibility({ organization: { type: 'SCO' } });

      expect(quest.isEligible(eligibility)).to.be.true;
    });

    it('return false', function () {
      const quest = new Quest({
        eligibilityRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.ORGANIZATION,
            data: {
              type: {
                data: 'SCO',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
        ],
        successRequirements: [],
      });

      const eligibility = new Eligibility({ organization: { type: 'PRO' } });

      expect(quest.isEligible(eligibility)).to.be.false;
    });
  });

  describe('#isSuccessful', function () {
    it('returns true when successfulRequirement is empty', function () {
      // given
      const quest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [],
      });
      const success = new Success({
        knowledgeElements: [
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillA' },
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillB' },
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillC' },
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillD' },
        ],
      });

      expect(quest.isSuccessful(success)).to.be.true;
    });

    it('returns true when all requirements are met', function () {
      // given
      const quest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.SKILL_PROFILE,
            data: {
              skillIds: ['skillA', 'skillB'],
              threshold: 100,
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.SKILL_PROFILE,
            data: {
              skillIds: ['skillC', 'skillD'],
              threshold: 50,
            },
          },
        ],
      });
      const success = new Success({
        knowledgeElements: [
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillA' },
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillB' },
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillC' },
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillD' },
        ],
      });

      expect(quest.isSuccessful(success)).to.be.true;
    });

    it('returns false when at least one requirement is not met', function () {
      // given
      const quest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.SKILL_PROFILE,
            data: {
              skillIds: ['skillA', 'skillB'],
              threshold: 100,
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.SKILL_PROFILE,
            data: {
              skillIds: ['skillC', 'skillD'],
              threshold: 50,
            },
          },
        ],
      });
      const success = new Success({
        knowledgeElements: [
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillA' },
          { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillB' },
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillC' },
          { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillD' },
        ],
      });

      expect(quest.isSuccessful(success)).to.be.false;
    });

    it('returns false when none of the requirements are met', function () {
      // given
      const quest = new Quest({
        eligibilityRequirements: [],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.SKILL_PROFILE,
            data: {
              skillIds: ['skillA', 'skillB'],
              threshold: 100,
            },
          },
          {
            requirement_type: REQUIREMENT_TYPES.SKILL_PROFILE,
            data: {
              skillIds: ['skillC', 'skillD'],
              threshold: 50,
            },
          },
        ],
      });
      const success = new Success({
        knowledgeElements: [
          { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillA' },
          { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillB' },
          { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillC' },
          { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillD' },
        ],
      });

      expect(quest.isSuccessful(success)).to.be.false;
    });
  });

  describe('#isCampaignParticipationContributingToQuest', function () {
    const organization = { type: 'SCO' };
    const organizationLearner = { id: 123 };

    context('at least one eligibilityRequirements is type of "campaignParticipations"', function () {
      it('return false if none of campaignParticipation eligibilityRequirement is valid given campaignParticipationId', function () {
        // given
        const eligibilityRequirements = [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.ORGANIZATION,
            data: {
              type: {
                data: 'SCO',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            data: {
              targetProfileId: {
                data: 1,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            data: {
              targetProfileId: {
                data: 2,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
        ];
        const quest = new Quest({ eligibilityRequirements, successRequirements: [] });
        const campaignParticipations = [
          { id: 10, targetProfileId: 1 },
          { id: 11, targetProfileId: 3 },
        ];
        const eligibilityData = new Eligibility({ organization, organizationLearner, campaignParticipations });
        const campaignParticipationIdToCheck = 11;

        // when
        const isContributing = quest.isCampaignParticipationContributingToQuest({
          eligibility: eligibilityData,
          campaignParticipationId: campaignParticipationIdToCheck,
        });

        // then
        expect(isContributing).to.be.false;
      });

      it('return true if one of campaignParticipation eligibilityRequirement is valid given campaignParticipationId', function () {
        // given
        const eligibilityRequirements = [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.ORGANIZATION,
            data: {
              type: {
                data: 'SCO',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            data: {
              targetProfileId: {
                data: 1,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
            data: {
              targetProfileId: {
                data: 2,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
        ];
        const quest = new Quest({ eligibilityRequirements, successRequirements: [] });
        const campaignParticipations = [
          { id: 10, targetProfileId: 1 },
          { id: 11, targetProfileId: 3 },
        ];
        const eligibilityData = new Eligibility({ organization, organizationLearner, campaignParticipations });
        const campaignParticipationIdToCheck = 10;

        // when
        const isContributing = quest.isCampaignParticipationContributingToQuest({
          eligibility: eligibilityData,
          campaignParticipationId: campaignParticipationIdToCheck,
        });

        // then
        expect(isContributing).to.be.true;
      });
    });

    context('eligibilityRequirement without campaignParticipation type', function () {
      it('return false when none of eligiblityRequirement is eligible', function () {
        // given
        const eligibilityRequirements = [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.ORGANIZATION,
            data: {
              type: {
                data: 'PRO',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
        ];
        const quest = new Quest({ eligibilityRequirements, successRequirements: [] });
        const campaignParticipations = [{ id: 10 }, { id: 11 }];
        const eligibilityData = new Eligibility({ organization, organizationLearner, campaignParticipations });
        const campaignParticipationIdToCheck = 11;

        // when
        const isContributing = quest.isCampaignParticipationContributingToQuest({
          eligibility: eligibilityData,
          campaignParticipationId: campaignParticipationIdToCheck,
        });

        // then
        expect(isContributing).to.be.false;
      });

      it('return false when eligibilityRequirement is partially eligible', function () {
        // given
        const eligibilityRequirements = [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.ORGANIZATION,
            data: {
              type: {
                data: 'SCO',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.ORGANIZATION_LEARNER,
            data: {
              id: {
                data: 456,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
        ];
        const quest = new Quest({ eligibilityRequirements, successRequirements: [] });
        const campaignParticipations = [{ id: 10 }, { id: 11 }];
        const eligibilityData = new Eligibility({ organization, organizationLearner, campaignParticipations });
        const campaignParticipationIdToCheck = 11;

        // when
        const isContributing = quest.isCampaignParticipationContributingToQuest({
          eligibility: eligibilityData,
          campaignParticipationId: campaignParticipationIdToCheck,
        });

        // then
        expect(isContributing).to.be.false;
      });

      it('return true if all eligibilityRequirement is valid', function () {
        // given
        const eligibilityRequirements = [
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.ORGANIZATION,
            data: {
              type: {
                data: 'SCO',
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
          {
            requirement_type: REQUIREMENT_TYPES.OBJECT.ORGANIZATION_LEARNER,
            data: {
              type: {
                id: 123,
                comparison: CRITERION_COMPARISONS.EQUAL,
              },
            },
            comparison: REQUIREMENT_COMPARISONS.ALL,
          },
        ];
        const quest = new Quest({ eligibilityRequirements, successRequirements: [] });
        const campaignParticipations = [{ id: 10 }, { id: 11 }];
        const eligibilityData = new Eligibility({ organization, organizationLearner, campaignParticipations });
        const campaignParticipationIdToCheck = 10;

        // when
        const isContributing = quest.isCampaignParticipationContributingToQuest({
          eligibility: eligibilityData,
          campaignParticipationId: campaignParticipationIdToCheck,
        });

        // then
        expect(isContributing).to.be.true;
      });
    });
  });

  describe('#toDTO', function () {
    it('should return a DTO version of the Quest', function () {
      // given
      const quest = new Quest({
        id: 123,
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2020-02-02'),
        rewardType: 'attestation',
        rewardId: 456,
        eligibilityRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.COMPOSE,
            comparison: REQUIREMENT_COMPARISONS.ONE_OF,
            data: [
              {
                requirement_type: REQUIREMENT_TYPES.COMPOSE,
                comparison: REQUIREMENT_COMPARISONS.ALL,
                data: [
                  {
                    requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                    data: {
                      targetProfileId: {
                        data: 1,
                        comparison: CRITERION_COMPARISONS.EQUAL,
                      },
                    },
                    comparison: REQUIREMENT_COMPARISONS.ONE_OF,
                  },
                  {
                    requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                    data: {
                      targetProfileId: {
                        data: 2,
                        comparison: CRITERION_COMPARISONS.EQUAL,
                      },
                    },
                    comparison: REQUIREMENT_COMPARISONS.ALL,
                  },
                ],
              },
              {
                requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                data: {
                  targetProfileId: {
                    data: 3,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                },
                comparison: REQUIREMENT_COMPARISONS.ONE_OF,
              },
            ],
          },
        ],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.SKILL_PROFILE,
            data: {
              skillIds: ['id1', 'id2'],
              threshold: 70,
            },
          },
        ],
      });

      // when
      const DTO = quest.toDTO();

      // then
      expect(DTO).to.deep.equal({
        id: 123,
        createdAt: new Date('2020-01-01'),
        updatedAt: new Date('2020-02-02'),
        rewardType: 'attestation',
        rewardId: 456,
        eligibilityRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.COMPOSE,
            comparison: REQUIREMENT_COMPARISONS.ONE_OF,
            data: [
              {
                requirement_type: REQUIREMENT_TYPES.COMPOSE,
                comparison: REQUIREMENT_COMPARISONS.ALL,
                data: [
                  {
                    requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                    data: {
                      targetProfileId: {
                        data: 1,
                        comparison: CRITERION_COMPARISONS.EQUAL,
                      },
                    },
                    comparison: REQUIREMENT_COMPARISONS.ONE_OF,
                  },
                  {
                    requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                    data: {
                      targetProfileId: {
                        data: 2,
                        comparison: CRITERION_COMPARISONS.EQUAL,
                      },
                    },
                    comparison: REQUIREMENT_COMPARISONS.ALL,
                  },
                ],
              },
              {
                requirement_type: REQUIREMENT_TYPES.OBJECT.CAMPAIGN_PARTICIPATIONS,
                data: {
                  targetProfileId: {
                    data: 3,
                    comparison: CRITERION_COMPARISONS.EQUAL,
                  },
                },
                comparison: REQUIREMENT_COMPARISONS.ONE_OF,
              },
            ],
          },
        ],
        successRequirements: [
          {
            requirement_type: REQUIREMENT_TYPES.SKILL_PROFILE,
            data: {
              skillIds: ['id1', 'id2'],
              threshold: 70,
            },
          },
        ],
      });
    });
  });
});
