import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class LanguageSwitcher extends Component {
  @service locale;

  get selectedLanguage() {
    return this.args.selectedLanguage;
  }

  @action
  onChange(value) {
    this.args.onLanguageChange(value);
  }

  get availableLanguages() {
    return this.locale.switcherDisplayedLanguages;
  }

  <template>
    <PixSelect
      @id="language-switcher"
      @screenReaderOnly={{true}}
      @iconName="globe"
      @value={{this.selectedLanguage}}
      @options={{this.availableLanguages}}
      @onChange={{this.onChange}}
      @hideDefaultOption="true"
    >
      <:label>{{t "pages.login.choose-language-aria-label"}}</:label>
    </PixSelect>
  </template>
}
