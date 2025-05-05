import { CompetenceResultForKnowledgeElementSnapshots } from './CompetenceResultForKnowledgeElementSnapshots.js';
import { TubeResultForKnowledgeElementSnapshots } from './TubeResultForKnowledgeElementSnapshots.js';

class CampaignResultLevelsPerTubesAndCompetences {
  #tubesWithLevels;

  constructor({ campaignId, learningContent, knowledgeElementsByParticipation } = {}) {
    this.id = campaignId;
    this.learningContent = learningContent;
    this.knowledgeElementSnapshots = Object.values(knowledgeElementsByParticipation);
    this.#tubesWithLevels = this.#getTubesWithLevels(learningContent.tubes);
  }

  #getTubesWithLevels(tubes) {
    return tubes.map((tube) => {
      return new TubeResultForKnowledgeElementSnapshots({
        tube,
        competence: this.learningContent.competences.find((competence) => competence.id === tube.competenceId),
        knowledgeElementSnapshots: this.knowledgeElementSnapshots,
      });
    });
  }

  get levelsPerTube() {
    return this.#tubesWithLevels;
  }

  get levelsPerCompetence() {
    return this.learningContent.competences.map((competence) => {
      return new CompetenceResultForKnowledgeElementSnapshots({
        competence,
        knowledgeElementSnapshots: this.knowledgeElementSnapshots,
      });
    });
  }

  get maxReachableLevel() {
    return averageBy(this.levelsPerTube, 'maxLevel');
  }

  get meanReachedLevel() {
    return averageBy(this.levelsPerTube, 'meanLevel');
  }
}

const averageBy = (collection, propName) => {
  if (!propName) {
    return collection.reduce((acc, value) => value + acc, 0) / collection.length;
  }
  return collection.reduce((acc, item) => acc + item[propName], 0) / collection.length;
};

export { CampaignResultLevelsPerTubesAndCompetences };
