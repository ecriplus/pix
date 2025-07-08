import { Assessment, Progression } from '../models/index.js';

class CampaignAssessment {
  constructor(assessment) {
    this.id = assessment.id;
    this.codeCampaign = assessment.campaign?.code;
    this.state = assessment.state;
    this.title = assessment.campaign?.title ?? '';
    this.type = Assessment.types.CAMPAIGN;
    this.answers = [];
    this.lastQuestionState = assessment.lastQuestionState;
    this.method = Assessment.methods.SMART_RANDOM;
    this.hasOngoingChallengeLiveAlert = false;
    this.hasOngoingCompanionLiveAlert = false;
    this.hasCheckpoints = assessment.campaign?.isAssessment ?? false;
    this.showProgressBar = assessment.campaign?.isAssessment ?? false;
    this.showLevelup = assessment.campaign?.isAssessment ?? false;
    this.showQuestionCounter = assessment.campaign?.isAssessment ?? false;
    this.answers = assessment.answers;
    this.orderedChallengeIdsAnswered = assessment.answers?.map((answer) => answer.challengeId) ?? [];
    this.competenceId = assessment.competenceId;
    this.nextChallenge = assessment.nextChallenge;
  }

  get progression() {
    if (!this.hasCheckpoints) {
      return undefined;
    }
    return { id: Progression.generateIdFromAssessmentId(this.id) };
  }
}

export { CampaignAssessment };
