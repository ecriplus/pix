import Route from '@ember/routing/route';

export default class TargetProfileIndexRoute extends Route {
  async model() {
    const complementaryCertification = await this.modelFor('authenticated.certification-frameworks.item');
    await complementaryCertification.reload();
    return complementaryCertification;
  }
}
