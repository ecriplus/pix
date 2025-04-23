import Controller from '@ember/controller';
import { service } from '@ember/service';

export default class UserCertificationsController extends Controller {
  @service featureToggles;

  get displayV3CandidateCertificate() {
    return this.featureToggles.featureToggles?.isV3CertificationPageEnabled && this.model.algorithmEngineVersion === 3;
  }
}
