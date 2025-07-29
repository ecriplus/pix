import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class LanguageSwitcher extends Component {
  @service locale;

  get availableLanguages() {
    return this.locale.switcherDisplayedLanguages;
  }

  <template>
    <PixSelect
      @id='language-switcher'
      @iconName='globe'
      @value={{@selectedLanguage}}
      @options={{this.availableLanguages}}
      @onChange={{@onLanguageChange}}
      @hideDefaultOption='true'
      @screenReaderOnly='true'
      ...attributes
    >
      <:label>{{t 'common.forms.login.choose-language-aria-label'}}</:label>
    </PixSelect>
  </template>
}
