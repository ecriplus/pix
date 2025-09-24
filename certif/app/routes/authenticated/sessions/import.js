import Route from '@ember/routing/route';
import { service } from '@ember/service';

export default class ImportRoute extends Route {
  @service router;
  @service currentUser;
  @service currentDomain;
  @service locale;

  beforeModel() {
    this.currentUser.checkRestrictedAccess();

    const topLevelDomain = this.currentDomain.getExtension();
    const currentLocale = this.locale.currentLocale;
    const isOrgTldAndEnglishCurrentLocale = topLevelDomain === 'org' && currentLocale === 'en';

    if (
      this.currentUser.currentAllowedCertificationCenterAccess.isScoManagingStudents ||
      isOrgTldAndEnglishCurrentLocale
    ) {
      return this.router.replaceWith('authenticated.sessions');
    }
  }

  resetController(controller) {
    controller.reset();
  }
}
