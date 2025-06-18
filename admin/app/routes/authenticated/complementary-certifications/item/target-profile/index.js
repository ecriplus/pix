import Route from '@ember/routing/route';

export default class TargetProfileIndexRoute extends Route {
  async model() {
    const complementaryCertification = await this.modelFor('authenticated.complementary-certifications.item');
    await complementaryCertification.reload();
    return complementaryCertification;
  }
}
