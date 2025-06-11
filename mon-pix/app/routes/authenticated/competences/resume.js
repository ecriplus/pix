import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ResumeRoute extends Route {
  @service store;
  @service router;

  competenceId = null;

  buildRouteInfoMetadata() {
    return { doNotTrackPage: true };
  }

  model(params, transition) {
    const competenceId = transition.to.parent.params.competence_id;
    return this.store.queryRecord('competence-evaluation', { competenceId, startOrResume: true });
  }

  async redirect(competenceEvaluation) {
    const assessment = await competenceEvaluation.assessment;
    this.router.replaceWith('assessments.resume', assessment.id);
  }
}
