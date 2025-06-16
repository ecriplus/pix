import Controller from '@ember/controller';
import sortBy from 'lodash/sortBy';

export default class TargetProfileDetailsController extends Controller {
  get areas() {
    return sortBy(this.model.areas, ['frameworkId', 'code']).map((area) => this.buildAreaViewModel(area));
  }

  buildAreaViewModel(area) {
    return {
      title: `${area.code} · ${area.title}`,
      color: area.color,
      competences: sortBy(area.hasMany('competences').value(), 'index').map((competence) =>
        this.buildCompetenceViewModel(competence),
      ),
    };
  }

  buildCompetenceViewModel(competence) {
    return {
      id: competence.id,
      title: `${competence.index} ${competence.name}`,
      thematics: sortBy(competence.hasMany('thematics').value(), 'index').map((thematic) =>
        this.buildThematicViewModel(thematic),
      ),
    };
  }

  buildThematicViewModel(thematic) {
    return {
      name: thematic.name,
      nbTubes: thematic.hasMany('tubes').value().length,
      tubes: sortBy(thematic.hasMany('tubes').value(), 'practicalTitle').map((tube) => this.buildTubeViewModel(tube)),
    };
  }

  buildTubeViewModel(tube) {
    return {
      id: tube.id,
      title: `${tube.name} : ${tube.practicalTitle}`,
      level: tube.level,
      mobile: tube.mobile,
      tablet: tube.tablet,
      skills: sortBy(tube.hasMany('skills').value(), 'difficulty').map((skill) => this.buildSkillViewModel(skill)),
    };
  }

  buildSkillViewModel(skill) {
    return {
      id: skill.id,
      difficulty: skill.difficulty,
    };
  }
}
