import { LearningContent } from './LearningContent.js';

class CampaignLearningContent extends LearningContent {
  constructor(frameworks) {
    super(frameworks);
  }

  get areas() {
    return super.areas.sort((a, b) => a.code.localeCompare(b.code));
  }

  get competences() {
    return super.competences.sort((a, b) => a.index.localeCompare(b.index));
  }
}

export { CampaignLearningContent };
