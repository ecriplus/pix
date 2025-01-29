import _ from 'lodash';

class LearningContent {
  constructor(frameworks) {
    this.frameworks = frameworks;
  }

  get areas() {
    return this.frameworks.flatMap((framework) => framework.areas);
  }

  get competences() {
    return this.areas.flatMap((area) => area.competences);
  }

  get thematics() {
    return this.competences.flatMap((competence) => competence.thematics);
  }

  // TODO faire sortir les tubes depuis les thématiques
  get tubes() {
    return this.competences.flatMap((competences) => competences.tubes);
  }

  get skills() {
    return this.tubes.flatMap((tube) => tube.skills);
  }

  get skillNames() {
    return this.skills.map((skill) => skill.name);
  }

  get tubeIds() {
    return this.tubes.map((tube) => tube.id);
  }

  findSkill(skillId) {
    return this.skills.find((skill) => skill.id === skillId) ?? null;
  }

  findTube(tubeId) {
    return this.tubes.find((tube) => tube.id === tubeId) ?? null;
  }

  findCompetence(competenceId) {
    return this.competences.find((competence) => competence.id === competenceId) ?? null;
  }

  findArea(areaId) {
    return this.areas.find((area) => area.id === areaId) ?? null;
  }

  findAreaOfCompetence(competence) {
    const area = this.findArea(competence.areaId);
    return area || null;
  }

  findFramework(frameworkId) {
    return this.frameworks.find((framework) => framework.id === frameworkId) ?? null;
  }

  findCompetenceIdOfSkill(skillId) {
    const tubeId = this.findSkill(skillId)?.tubeId;
    if (!tubeId) return null;
    return this.findTube(tubeId).competenceId;
  }

  findFrameworkNameOfArea(areaId) {
    const frameworkId = this.findArea(areaId)?.frameworkId;
    if (!frameworkId) return '';
    return this.findFramework(frameworkId).name;
  }
  getValidatedKnowledgeElementsGroupedByTube(knowledgeElements) {
    return this._filterTargetedKnowledgeElementAndGroupByTube(
      knowledgeElements,
      (knowledgeElement) => knowledgeElement.isValidated,
    );
  }

  getKnowledgeElementsGroupedByCompetence(knowledgeElements) {
    return this._filterTargetedKnowledgeElementAndGroupByCompetence(knowledgeElements);
  }

  countValidatedTargetedKnowledgeElementsByCompetence(knowledgeElements) {
    const validatedGroupedByCompetence = this._filterTargetedKnowledgeElementAndGroupByCompetence(
      knowledgeElements,
      (knowledgeElement) => knowledgeElement.isValidated,
    );
    return _.mapValues(validatedGroupedByCompetence, 'length');
  }

  _getTubeIdOfSkill(skillId) {
    const skillTube = this.tubes.find((tube) => tube.hasSkill(skillId));

    return skillTube ? skillTube.id : null;
  }

  _filterTargetedKnowledgeElementAndGroupByTube(knowledgeElements, knowledgeElementFilter = () => true) {
    const knowledgeElementsGroupedByTube = {};
    for (const tubeId of this.tubeIds) {
      knowledgeElementsGroupedByTube[tubeId] = [];
    }
    for (const knowledgeElement of knowledgeElements) {
      const tubeId = this._getTubeIdOfSkill(knowledgeElement.skillId);
      if (tubeId && knowledgeElementFilter(knowledgeElement)) {
        knowledgeElementsGroupedByTube[tubeId].push(knowledgeElement);
      }
    }

    return knowledgeElementsGroupedByTube;
  }

  _filterTargetedKnowledgeElementAndGroupByCompetence(knowledgeElements, knowledgeElementFilter = () => true) {
    const knowledgeElementsGroupedByCompetence = {};
    for (const competence of this.competences) {
      knowledgeElementsGroupedByCompetence[competence.id] = [];
    }
    for (const knowledgeElement of knowledgeElements) {
      const competenceId = this.findCompetenceIdOfSkill(knowledgeElement.skillId);
      if (competenceId && knowledgeElementFilter(knowledgeElement)) {
        knowledgeElementsGroupedByCompetence[competenceId].push(knowledgeElement);
      }
    }

    return knowledgeElementsGroupedByCompetence;
  }

  get maxSkillDifficulty() {
    const skillMaxDifficulty = _.maxBy(this.skills, 'difficulty');
    return skillMaxDifficulty ? skillMaxDifficulty.difficulty : null;
  }
}

export { LearningContent };
