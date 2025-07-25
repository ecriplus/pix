import Controller from '@ember/controller';

export default class UserCertificationsController extends Controller {
  get displayV3CandidateCertificate() {
    return this.model.algorithmEngineVersion === 3;
  }
}
