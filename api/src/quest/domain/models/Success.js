import { KnowledgeElement } from '../../../shared/domain/models/index.js';

export class Success {
  constructor({ knowledgeElements }) {
    this.knowledgeElements = knowledgeElements;
  }

  getMasteryPercentageForSkills(skillIds) {
    // genre de doublon avec api/src/shared/domain/models/CampaignParticipationResult.js:64
    const totalSkillsCount = skillIds?.length;
    if (!totalSkillsCount) {
      return 0;
    }
    const validatedSkillsCount = this.knowledgeElements.filter(
      (ke) => ke.status === KnowledgeElement.StatusType.VALIDATED && skillIds.includes(ke.skillId),
    ).length;
    return Math.round((validatedSkillsCount * 100) / totalSkillsCount);
  }
}
