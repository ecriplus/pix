import { TubeResultForKnowledgeElementSnapshots } from './TubeResultForKnowledgeElementSnapshots.js';

class CompetenceResultForKnowledgeElementSnapshots {
  id;
  index;
  name;
  description;
  meanLevel;
  maxLevel;

  constructor({ competence, knowledgeElementSnapshots } = {}) {
    const tubeResults = competence.tubes.map(
      (tube) => new TubeResultForKnowledgeElementSnapshots({ tube, knowledgeElementSnapshots, competence }),
    );

    this.id = competence.id;
    this.index = competence.index;
    this.name = competence.name;
    this.description = competence.description;
    this.maxLevel = averageBy(tubeResults, 'maxLevel');
    this.meanLevel = averageBy(tubeResults, 'meanLevel');
  }
}

const averageBy = (collection, propName) => {
  if (!propName) {
    return collection.reduce((acc, value) => value + acc, 0) / collection.length;
  }
  return collection.reduce((acc, item) => acc + item[propName], 0) / collection.length;
};

export { CompetenceResultForKnowledgeElementSnapshots };
