import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class AttachTargetProfileRoute extends Route {
  @service accessControl;

  beforeModel() {
    this.accessControl.restrictAccessTo(['isSuperAdmin'], 'authenticated.certification-frameworks.item.target-profile');
  }

  model(params) {
    const complementaryCertification = this.modelFor('authenticated.certification-frameworks.item.target-profile');

    const targetProfileId = parseInt(params.target_profile_id);

    return {
      complementaryCertification,
      currentTargetProfile: complementaryCertification.currentTargetProfiles?.find(({ id }) => id === targetProfileId),
    };
  }
}
