const { expect, domainBuilder } = require('../../../test-helper');
const SmartPlacementAnswer = require('../../../../lib/domain/models/SmartPlacementAnswer');
const SmartPlacementAssessment = require('../../../../lib/domain/models/SmartPlacementAssessment');
const SmartPlacementKnowledgeElement = require('../../../../lib/domain/models/SmartPlacementKnowledgeElement');
const SkillReview = require('../../../../lib/domain/models/SkillReview');

function generateSmartPlacementAssessmentWithNoKnowledgeElement() {
  const skills = domainBuilder.buildSkillCollection();
  const targetProfile = domainBuilder.buildTargetProfile({ skills });

  return domainBuilder.buildSmartPlacementAssessment({
    skills,
    answers: [],
    knowledgeElements: [],
    targetProfile,
  });
}

function generateSmartPlacementAssessmentDataWithThreeKnowledgeElements({
  knowledgeElement1Status,
  knowledgeElement2Status,
  knowledgeElement3Status,
}) {
  function answerStatusForKnowledgeElementStatus(knowledgeElementStatus) {
    return knowledgeElementStatus === SmartPlacementKnowledgeElement.StatusType.VALIDATED ?
      SmartPlacementAnswer.ResultType.OK : SmartPlacementAnswer.ResultType.KO;
  }

  const skillsFromOneTube = domainBuilder.buildSkillCollection();
  const skillsFromAnotherTube = domainBuilder.buildSkillCollection();
  const skills = skillsFromOneTube.concat(skillsFromAnotherTube);

  const [skill1, skill2] = skillsFromOneTube;
  const [, skill3] = skillsFromOneTube;

  const targetProfile = domainBuilder.buildTargetProfile({ skills });

  const answer1 = domainBuilder.buildSmartPlacementAnswer({
    result: answerStatusForKnowledgeElementStatus(knowledgeElement1Status),
  });
  const knowledgeElement1 = domainBuilder.buildSmartPlacementKnowledgeElement({
    answerId: answer1.id,
    skillId: skill1.id,
    status: knowledgeElement1Status,
  });

  const answer2 = domainBuilder.buildSmartPlacementAnswer({
    result: answerStatusForKnowledgeElementStatus(knowledgeElement2Status),
  });

  const knowledgeElement2 = domainBuilder.buildSmartPlacementKnowledgeElement({
    answerId: answer2.id,
    skillId: skill2.id,
    status: knowledgeElement2Status,
  });

  const answer3 = domainBuilder.buildSmartPlacementAnswer({
    result: answerStatusForKnowledgeElementStatus(knowledgeElement3Status),
  });
  const knowledgeElement3 = domainBuilder.buildSmartPlacementKnowledgeElement({
    answerId: answer3.id,
    skillId: skill3.id,
    status: knowledgeElement3Status,
  });

  return {
    assessment: domainBuilder.buildSmartPlacementAssessment({
      skills,
      answers: [answer1, answer2, answer3],
      knowledgeElements: [knowledgeElement1, knowledgeElement2, knowledgeElement3],
      targetProfile,
    }),
    knowledgeElement1Skill: skill1,
    knowledgeElement2Skill: skill2,
    knowledgeElement3Skill: skill3,
  };
}

describe('Unit | Domain | Models | SmartPlacementAssessment', () => {

  describe('#isCompleted', () => {

    it('should be true if state is completed', () => {
      // given
      const assessment = domainBuilder.buildSmartPlacementAssessment({
        state: SmartPlacementAssessment.State.COMPLETED,
      });

      // when
      const isCompleted = assessment.isCompleted;

      // then
      expect(isCompleted).to.be.true;
    });

    it('should be false if state not completed', () => {
      // given
      const assessment = domainBuilder.buildSmartPlacementAssessment({
        state: SmartPlacementAssessment.State.STARTED,
      });

      // when
      const isCompleted = assessment.isCompleted;

      // then
      expect(isCompleted).to.be.false;
    });
  });

  describe('#isStarted', () => {

    it('should be true if state is started', () => {
      // given
      const assessment = domainBuilder.buildSmartPlacementAssessment({
        state: SmartPlacementAssessment.State.STARTED,
      });

      // when
      const isStarted = assessment.isStarted;

      // then
      expect(isStarted).to.be.true;
    });

    it('should be false if state not started', () => {
      // given
      const assessment = domainBuilder.buildSmartPlacementAssessment({
        state: SmartPlacementAssessment.State.COMPLETED,
      });

      // when
      const isStarted = assessment.isStarted;

      // then
      expect(isStarted).to.be.false;
    });
  });

  describe('#getValidatedSkills', () => {

    it('should return no skill if no knowledge elements', () => {
      // given
      const assessment = generateSmartPlacementAssessmentWithNoKnowledgeElement();

      const expectedValidatedSkills = [];

      // when
      const validatedSkills = assessment.getValidatedSkills();

      // then
      expect(validatedSkills).to.deep.equal(expectedValidatedSkills);
    });

    it('should sum all skills validated in knowledge elements', () => {
      // given
      const { assessment, knowledgeElement1Skill, knowledgeElement2Skill } =
        generateSmartPlacementAssessmentDataWithThreeKnowledgeElements({
          knowledgeElement1Status: SmartPlacementKnowledgeElement.StatusType.VALIDATED,
          knowledgeElement2Status: SmartPlacementKnowledgeElement.StatusType.VALIDATED,
          knowledgeElement3Status: SmartPlacementKnowledgeElement.StatusType.INVALIDATED,
        });

      const expectedValidatedSkills = [knowledgeElement1Skill, knowledgeElement2Skill];

      // when
      const validatedSkills = assessment.getValidatedSkills();

      // then
      expect(validatedSkills).to.deep.equal(expectedValidatedSkills);
    });
  });

  describe('#getFailedSkills', () => {

    it('should return no skill if no knowledge elements', () => {
      // given
      const assessment = generateSmartPlacementAssessmentWithNoKnowledgeElement();

      const expectedFailedSkills = [];

      // when
      const failedSkills = assessment.getFailedSkills();

      // then
      expect(failedSkills).to.deep.equal(expectedFailedSkills);
    });

    it('should sum all skills failed in knowledge elements', () => {
      // given
      const { assessment, knowledgeElement1Skill, knowledgeElement2Skill } =
        generateSmartPlacementAssessmentDataWithThreeKnowledgeElements({
          knowledgeElement1Status: SmartPlacementKnowledgeElement.StatusType.INVALIDATED,
          knowledgeElement2Status: SmartPlacementKnowledgeElement.StatusType.INVALIDATED,
          knowledgeElement3Status: SmartPlacementKnowledgeElement.StatusType.VALIDATED,
        });

      const expectedFailedSkills = [knowledgeElement1Skill, knowledgeElement2Skill];

      // when
      const failedSkills = assessment.getFailedSkills();

      // then
      expect(failedSkills).to.deep.equal(expectedFailedSkills);
    });
  });

  describe('#getUnratableSkills', () => {

    context('when the assessment is STARTED', () => {

      it('should return an empty array', () => {
        // given
        const { assessment } =
          generateSmartPlacementAssessmentDataWithThreeKnowledgeElements({
            knowledgeElement1Status: SmartPlacementKnowledgeElement.StatusType.INVALIDATED,
            knowledgeElement2Status: SmartPlacementKnowledgeElement.StatusType.VALIDATED,
          });

        assessment.state = SmartPlacementAssessment.State.STARTED;

        // when
        const unratableSkills = assessment.getUnratableSkills();

        // then
        expect(unratableSkills).to.deep.equal([]);
      });
    });

    context('when the assessment is COMPLETED', () => {

      it('should return a list of unratable skills', () => {
        // given
        const validatedSkill = domainBuilder.buildSkill({ name: '@good2' });
        const unratableSkill = domainBuilder.buildSkill({ name: '@ignored5' });

        const targetProfile = domainBuilder.buildTargetProfile({ skills: [validatedSkill, unratableSkill] });

        const knowledgeElementForGood2 = domainBuilder.buildSmartPlacementKnowledgeElement({
          answerId: -1,
          skillId: validatedSkill.id,
          status: SmartPlacementKnowledgeElement.StatusType.VALIDATED,
          source: SmartPlacementKnowledgeElement.SourceType.DIRECT,
        });

        const assessment = domainBuilder.buildSmartPlacementAssessment({
          state: SmartPlacementAssessment.State.COMPLETED,
          answers: [],
          knowledgeElements: [knowledgeElementForGood2],
          targetProfile,
        });

        // when
        const unratableSkills = assessment.getUnratableSkills();

        // then
        expect(unratableSkills).to.deep.equal([
          unratableSkill,
        ]);
      });
    });
  });

  describe('#generateSkillReview', () => {

    it('should return a skill review with the right skills', () => {
      // given
      const { assessment } =
        generateSmartPlacementAssessmentDataWithThreeKnowledgeElements({
          knowledgeElement1Status: SmartPlacementKnowledgeElement.StatusType.INVALIDATED,
          knowledgeElement2Status: SmartPlacementKnowledgeElement.StatusType.UNRATABLE,
          knowledgeElement3Status: SmartPlacementKnowledgeElement.StatusType.VALIDATED,
        });

      // when
      const skillReview = assessment.generateSkillReview();

      // then
      expect(skillReview).to.be.an.instanceof(SkillReview);
      expect(skillReview.id).to.be.equal(`skill-review-${assessment.id}`);
      expect(skillReview.targetedSkills).to.be.deep.equal(assessment.targetProfile.skills);
      expect(skillReview.validatedSkills).to.be.deep.equal(assessment.getValidatedSkills());
      expect(skillReview.failedSkills).to.be.deep.equal(assessment.getFailedSkills());
      expect(skillReview.unratableSkills).to.be.deep.equal(assessment.getUnratableSkills());
    });
  });
});
