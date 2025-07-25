import Controller from '@ember/controller';

export default class SharedCertificationController extends Controller {
  get displayV3CertificationShared() {
    return this.model.algorithmEngineVersion === 3;
  }
}
