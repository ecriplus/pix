import { service } from '@ember/service';
import Component from '@glimmer/component';

export default class PanelHeader extends Component {
  @service currentUser;
  @service currentDomain;
  @service intl;

  get shouldRenderImportTemplateButton() {
    const topLevelDomain = this.currentDomain.getExtension();
    const currentLanguage = this.intl.primaryLocale;
    const isOrgTldAndEnglishCurrentLanguage = topLevelDomain === 'org' && currentLanguage === 'en';

    return (
      !this.currentUser.currentAllowedCertificationCenterAccess.isScoManagingStudents &&
      !isOrgTldAndEnglishCurrentLanguage
    );
  }
}
