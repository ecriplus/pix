import { TubeResultForKnowledgeElementSnapshots } from './TubeResultForKnowledgeElementSnapshots.js';

class CompetenceResultForKnowledgeElementSnapshots {
  #tubeResults;

  id;
  index;
  name;
  description;
  meanLevel;
  maxLevel;

  constructor({ competence } = {}) {
    this.#tubeResults = competence.tubes.map(
      (tube) => new TubeResultForKnowledgeElementSnapshots({ tube, competence }),
    );

    this.id = competence.id;
    this.index = competence.index;
    this.name = competence.name;
    this.description = competence.description;
  }

  addKnowledgeElementSnapshots(knowledgeElementSnapshots) {
    this.#tubeResults.forEach((tubesWithLevel) =>
      tubesWithLevel.addKnowledgeElementSnapshots(knowledgeElementSnapshots),
    );
    this.maxLevel = averageBy(this.#tubeResults, 'maxLevel');
    this.meanLevel = averageBy(this.#tubeResults, 'meanLevel');
  }
}

const averageBy = (collection, propName) => {
  if (!propName) {
    return collection.reduce((acc, value) => value + acc, 0) / collection.length;
  }
  return collection.reduce((acc, item) => acc + item[propName], 0) / collection.length;
};

export { CompetenceResultForKnowledgeElementSnapshots };
