import { KnowledgeElement } from '../../../../shared/domain/models/KnowledgeElement.js';

class TubeResultForKnowledgeElementSnapshots {
  id;
  competenceId;
  competenceName;
  title;
  description;
  meanLevel;
  maxLevel;

  constructor({ tube, knowledgeElementSnapshots, competence } = {}) {
    const skillIds = tube.skills.map((skill) => skill.id);

    const tubeValidatedKnowledgeElementSnapshots = knowledgeElementSnapshots.map((knowledgeElementSnapshot) =>
      knowledgeElementSnapshot
        .filter((ke) => ke.status === KnowledgeElement.StatusType.VALIDATED)
        .filter((ke) => skillIds.includes(ke.skillId)),
    );

    const difficultyBySkillId = competence.skills.reduce(
      (acc, skill) => ({ ...acc, [skill.id]: skill.difficulty }),
      {},
    );

    this.id = tube.id;
    this.competenceId = competence.id;
    this.competenceName = competence.name;
    this.title = tube.practicalTitle;
    this.description = tube.practicalDescription;
    this.maxLevel = tube.getHardestSkill().difficulty;
    this.meanLevel = this.#computeMeanLevel(difficultyBySkillId, tubeValidatedKnowledgeElementSnapshots);
  }

  #computeMeanLevel(difficultyBySkillId, knowledgeElementSnapshots) {
    const knowledgeElementSnapshotReachedLevels = knowledgeElementSnapshots.map((knowledgeElementSnapshot) => {
      if (knowledgeElementSnapshot.length === 0) {
        return 0;
      }
      return Math.max(
        ...knowledgeElementSnapshot.map((knowledgeElement) => difficultyBySkillId[knowledgeElement.skillId]),
      );
    });
    if (knowledgeElementSnapshotReachedLevels.length === 0) {
      return 0;
    }
    return average(knowledgeElementSnapshotReachedLevels);
  }
}

const average = (collection) => collection.reduce((acc, value) => acc + value, 0) / collection.length;

export { TubeResultForKnowledgeElementSnapshots };
