import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AttachTargetProfileNewRoute extends Route {
  @service accessControl;

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin'], 'authenticated.certification-frameworks.item.target-profile');
  }

  model(_) {
    const complementaryCertification = this.modelFor('authenticated.certification-frameworks.item.target-profile');

    return {
      complementaryCertification,
      currentTargetProfile: null,
    };
  }
}
