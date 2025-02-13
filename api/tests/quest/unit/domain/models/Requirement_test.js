import { COMPARISON as CRITERION_PROPERTY_COMPARISON } from '../../../../../src/quest/domain/models/CriterionProperty.js';
import { TYPES } from '../../../../../src/quest/domain/models/Eligibility.js';
import { Eligibility } from '../../../../../src/quest/domain/models/Eligibility.js';
import { COMPARISON } from '../../../../../src/quest/domain/models/Quest.js';
import {
  buildRequirement,
  COMPOSE_TYPE,
  ComposedRequirement,
  ObjectRequirement,
  SKILL_PROFILE_TYPE,
  SkillProfileRequirement,
} from '../../../../../src/quest/domain/models/Requirement.js';
import { Success } from '../../../../../src/quest/domain/models/Success.js';
import { KnowledgeElement } from '../../../../../src/shared/domain/models/index.js';
import { expect } from '../../../../test-helper.js';

describe('Quest | Unit | Domain | Models | Requirement ', function () {
  describe('Factory - buildRequirement', function () {
    context('when requirement_type is compose', function () {
      it('should build a ComposedRequirement', function () {
        // given
        const buildData = {
          requirement_type: COMPOSE_TYPE,
          comparison: COMPARISON.ALL,
          data: [],
        };

        // when
        const requirement = buildRequirement(buildData);

        // then
        expect(requirement instanceof ComposedRequirement).to.be.true;
      });
    });

    context('when requirement_type is "organization"', function () {
      it('should build an ObjectRequirement', function () {
        // given
        const buildData = {
          requirement_type: TYPES.ORGANIZATION,
          comparison: COMPARISON.ALL,
          data: {},
        };

        // when
        const requirement = buildRequirement(buildData);

        // then
        expect(requirement instanceof ObjectRequirement).to.be.true;
      });
    });

    context('when requirement_type is "organizationLearner"', function () {
      it('should build an ObjectRequirement', function () {
        // given
        const buildData = {
          requirement_type: TYPES.ORGANIZATION_LEARNER,
          comparison: COMPARISON.ALL,
          data: {},
        };

        // when
        const requirement = buildRequirement(buildData);

        // then
        expect(requirement instanceof ObjectRequirement).to.be.true;
      });
    });

    context('when requirement_type is "campaignParticipations"', function () {
      it('should build an ObjectRequirement', function () {
        // given
        const buildData = {
          requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISON.ALL,
          data: {},
        };

        // when
        const requirement = buildRequirement(buildData);

        // then
        expect(requirement instanceof ObjectRequirement).to.be.true;
      });
    });

    context('when requirement_type is "skillProfile"', function () {
      it('should build an SkillProfileRequirement', function () {
        // given
        const buildData = {
          requirement_type: SKILL_PROFILE_TYPE,
          comparison: 'irrelevant',
          data: {},
        };

        // when
        const requirement = buildRequirement(buildData);

        // then
        expect(requirement instanceof SkillProfileRequirement).to.be.true;
      });
    });

    context('when requirement_type is unknown', function () {
      it('should throw an error', function () {
        // given
        const buildData = {
          requirement_type: 'yolo',
          comparison: COMPARISON.ALL,
          data: {},
        };

        // when / then
        expect(() => buildRequirement(buildData)).to.throw('Unknown requirement_type "yolo"');
      });
    });
  });

  describe('ComposedRequirement', function () {
    describe('constructor', function () {
      it('should build the same instance whether we are passing through raw requirements or instanciated requirements', function () {
        // given
        const requirementA = new ComposedRequirement({
          comparison: COMPARISON.ALL,
          data: [
            {
              requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
              data: {
                targetProfileId: {
                  data: 1,
                  comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                },
              },
              comparison: COMPARISON.ONE_OF,
            },
            {
              requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
              data: {
                targetProfileId: {
                  data: 2,
                  comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                },
              },
              comparison: COMPARISON.ALL,
            },
          ],
        });
        const requirementB = new ComposedRequirement({
          requirement_type: requirementA.requirement_type,
          comparison: requirementA.comparison,
          data: requirementA.data,
        });

        // when / then
        expect(requirementA.toDTO()).to.deep.equal(requirementB.toDTO());
      });
    });

    describe('isFulfilled', function () {
      describe('when comparison is ALL', function () {
        it('should return true if all requirements are met', function () {
          const requirement = new ComposedRequirement({
            comparison: COMPARISON.ALL,
            data: [
              {
                requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
                data: {
                  targetProfileId: {
                    data: 1,
                    comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                  },
                },
                comparison: COMPARISON.ALL,
              },
              {
                requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
                data: {
                  targetProfileId: {
                    data: 2,
                    comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                  },
                },
                comparison: COMPARISON.ALL,
              },
            ],
          });
          const eligibility = new Eligibility({
            campaignParticipations: [{ targetProfileId: 1 }, { targetProfileId: 2 }],
          });

          expect(requirement.isFulfilled(eligibility)).to.be.true;
        });

        it('should return false if all requirements are not met', function () {
          const requirement = new ComposedRequirement({
            comparison: COMPARISON.ALL,
            data: [
              {
                requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
                data: {
                  targetProfileId: {
                    data: 1,
                    comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                  },
                },
                comparison: COMPARISON.ALL,
              },
              {
                requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
                data: {
                  targetProfileId: {
                    data: 2,
                    comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                  },
                },
                comparison: COMPARISON.ALL,
              },
            ],
          });
          const eligibility = new Eligibility({
            campaignParticipations: [{ targetProfileId: 1 }, { targetProfileId: 3 }],
          });

          expect(requirement.isFulfilled(eligibility)).to.be.false;
        });
      });

      describe('when comparison is ONE_OF', function () {
        it('should return true if one of the requirements is met', function () {
          const requirement = new ComposedRequirement({
            comparison: COMPARISON.ONE_OF,
            data: [
              {
                requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
                data: {
                  targetProfileId: {
                    data: 1,
                    comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                  },
                },
                comparison: COMPARISON.ALL,
              },
              {
                requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
                data: {
                  targetProfileId: {
                    data: 2,
                    comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                  },
                },
                comparison: COMPARISON.ALL,
              },
            ],
          });
          const eligibility = new Eligibility({
            campaignParticipations: [{ targetProfileId: 1 }],
          });

          expect(requirement.isFulfilled(eligibility)).to.be.true;
        });

        it('should return false if none of the requirements are met', function () {
          const requirement = new ComposedRequirement({
            comparison: COMPARISON.ONE_OF,
            data: [
              {
                requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
                data: {
                  targetProfileId: {
                    data: 1,
                    comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                  },
                },
                comparison: COMPARISON.ALL,
              },
              {
                requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
                data: {
                  targetProfileId: {
                    data: 2,
                    comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                  },
                },
                comparison: COMPARISON.ALL,
              },
            ],
          });
          const eligibility = new Eligibility({
            campaignParticipations: [{ targetProfileId: 3 }],
          });

          expect(requirement.isFulfilled(eligibility)).to.be.false;
        });
      });
    });

    describe('toDTO', function () {
      it('should transform into a DTO the requirement recursively', function () {
        // given
        const rootRequirement = new ComposedRequirement({
          data: [
            {
              requirement_type: TYPES.ORGANIZATION,
              data: {
                keyA: {
                  data: 'valueA',
                  comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                },
              },
              comparison: COMPARISON.ALL,
            },
            {
              requirement_type: COMPOSE_TYPE,
              data: [
                {
                  requirement_type: TYPES.ORGANIZATION_LEARNER,
                  data: {
                    keyB: {
                      data: 'valueB',
                      comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                    },
                  },
                  comparison: COMPARISON.ONE_OF,
                },
                {
                  requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
                  data: {
                    keyC: {
                      data: 'valueC',
                      comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                    },
                  },
                  comparison: COMPARISON.ONE_OF,
                },
              ],
              comparison: COMPARISON.ALL,
            },
          ],
          comparison: COMPARISON.ALL,
        });

        // when
        const DTO = rootRequirement.toDTO();

        // then
        expect(DTO).to.deep.equal({
          requirement_type: COMPOSE_TYPE,
          data: [
            {
              requirement_type: TYPES.ORGANIZATION,
              data: {
                keyA: {
                  data: 'valueA',
                  comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                },
              },
              comparison: COMPARISON.ALL,
            },
            {
              requirement_type: COMPOSE_TYPE,
              data: [
                {
                  requirement_type: TYPES.ORGANIZATION_LEARNER,
                  data: {
                    keyB: {
                      data: 'valueB',
                      comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                    },
                  },
                  comparison: COMPARISON.ONE_OF,
                },
                {
                  requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
                  data: {
                    keyC: {
                      data: 'valueC',
                      comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
                    },
                  },
                  comparison: COMPARISON.ONE_OF,
                },
              ],
              comparison: COMPARISON.ALL,
            },
          ],
          comparison: COMPARISON.ALL,
        });
      });
    });
  });

  describe('ObjectRequirement', function () {
    describe('constructor', function () {
      it('should build the same instance whether we are passing through raw criterion or instanciated criterion', function () {
        // given
        const requirementA = new ObjectRequirement({
          requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
          comparison: COMPARISON.ALL,
          data: {
            targetProfileId: {
              data: 1,
              comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
            },
          },
        });
        const requirementB = new ObjectRequirement({
          requirement_type: requirementA.requirement_type,
          comparison: requirementA.comparison,
          data: requirementA.data,
        });

        // when / then
        expect(requirementA.toDTO()).to.deep.equal(requirementB.toDTO());
      });
    });

    describe('isFulfilled', function () {
      describe('when dataInput attribute is not an array', function () {
        it('it should return true if criterion is valid', function () {
          const requirement = new ObjectRequirement({
            requirement_type: TYPES.ORGANIZATION,
            comparison: COMPARISON.ALL,
            data: {
              type: {
                data: 'SCO',
                comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
              },
            },
          });
          const eligibility = new Eligibility({
            organization: {
              type: 'SCO',
            },
          });

          expect(requirement.isFulfilled(eligibility)).to.be.true;
        });

        it('it should return false if criterion is not valid', function () {
          const requirement = new ObjectRequirement({
            requirement_type: TYPES.ORGANIZATION,
            comparison: COMPARISON.ALL,
            data: {
              type: {
                data: 'SCO',
                comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
              },
            },
          });
          const eligibility = new Eligibility({
            organization: {
              type: 'PRO',
            },
          });

          expect(requirement.isFulfilled(eligibility)).to.be.false;
        });
      });

      describe('when dataInput attribute is an array', function () {
        it('it should return true if one of the dataInput item validate criterion', function () {
          const requirement = new ObjectRequirement({
            requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
            comparison: COMPARISON.ALL,
            data: {
              targetProfileId: {
                data: 1,
                comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
              },
            },
          });
          const eligibility = new Eligibility({
            campaignParticipations: [{ targetProfileId: 2 }, { targetProfileId: 1 }],
          });

          expect(requirement.isFulfilled(eligibility)).to.be.true;
        });

        it('it should return false if none of the dataInput item validate criterion', function () {
          const requirement = new ObjectRequirement({
            requirement_type: TYPES.CAMPAIGN_PARTICIPATIONS,
            comparison: COMPARISON.ALL,
            data: {
              targetProfileId: {
                data: 3,
                comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
              },
            },
          });
          const eligibility = new Eligibility({
            campaignParticipations: [{ targetProfileId: 2 }, { targetProfileId: 1 }],
          });

          expect(requirement.isFulfilled(eligibility)).to.be.false;
        });
      });
    });

    describe('toDTO', function () {
      it('should transform into a DTO', function () {
        // given
        const requirement = new ObjectRequirement({
          requirement_type: TYPES.ORGANIZATION,
          data: {
            keyA: {
              data: 'valueA',
              comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
            },
          },
          comparison: COMPARISON.ALL,
        });

        // when
        const DTO = requirement.toDTO();

        // then
        expect(DTO).to.deep.equal({
          requirement_type: TYPES.ORGANIZATION,
          data: {
            keyA: {
              data: 'valueA',
              comparison: CRITERION_PROPERTY_COMPARISON.EQUAL,
            },
          },
          comparison: COMPARISON.ALL,
        });
      });
    });
  });

  describe('SkillProfileRequirement', function () {
    describe('isFulfilled', function () {
      context("when dataInput's masteryPercentage is below threshold", function () {
        it('should return false', function () {
          const requirement = new SkillProfileRequirement({
            data: {
              skillIds: ['skillB', 'skillA', 'skillC', 'skillE'],
              threshold: 51,
            },
          });
          const successWith50MasteryPercentage = new Success({
            knowledgeElements: [
              { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillA' },
              { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillB' },
              { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillC' },
              { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillD' },
            ],
          });

          expect(requirement.isFulfilled(successWith50MasteryPercentage)).to.be.false;
        });
      });

      context("when dataInput's masteryPercentage is equal to threshold", function () {
        it('should return true', function () {
          const requirement = new SkillProfileRequirement({
            data: {
              skillIds: ['skillB', 'skillA', 'skillC', 'skillE'],
              threshold: 50,
            },
          });
          const successWith50MasteryPercentage = new Success({
            knowledgeElements: [
              { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillA' },
              { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillB' },
              { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillC' },
              { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillD' },
            ],
          });

          expect(requirement.isFulfilled(successWith50MasteryPercentage)).to.be.true;
        });
      });

      context("when dataInput's masteryPercentage is above threshold", function () {
        it('should return true', function () {
          const requirement = new SkillProfileRequirement({
            data: {
              skillIds: ['skillB', 'skillA', 'skillC', 'skillE'],
              threshold: 49,
            },
          });
          const successWith50MasteryPercentage = new Success({
            knowledgeElements: [
              { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillA' },
              { status: KnowledgeElement.StatusType.VALIDATED, skillId: 'skillB' },
              { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillC' },
              { status: KnowledgeElement.StatusType.INVALIDATED, skillId: 'skillD' },
            ],
          });

          expect(requirement.isFulfilled(successWith50MasteryPercentage)).to.be.true;
        });
      });
    });

    describe('toDTO', function () {
      it('should transform into a DTO', function () {
        // given
        const requirement = new SkillProfileRequirement({
          data: {
            skillIds: ['id1', 'id2'],
            threshold: 70,
          },
        });

        // when
        const DTO = requirement.toDTO();

        // then
        expect(DTO).to.deep.equal({
          requirement_type: SKILL_PROFILE_TYPE,
          data: {
            skillIds: ['id1', 'id2'],
            threshold: 70,
          },
        });
      });
    });
  });
});
