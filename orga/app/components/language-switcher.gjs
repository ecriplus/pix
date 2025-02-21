import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import languages from 'pix-orga/languages';

const FRENCH_LANGUAGE = 'fr';

export default class LanguageSwitcher extends Component {
  get selectedLanguage() {
    return this.args.selectedLanguage;
  }

  availableLanguages = this.mapToOptions(languages);

  @action
  onChange(value) {
    this.args.onLanguageChange(value);
  }

  mapToOptions(languages) {
    const options = Object.entries(languages)
      .filter(([_, config]) => config.languageSwitcherDisplayed)
      .map(([key, config]) => ({
        label: config.value,
        value: key,
      }));

    const optionsWithoutFrSortedByLabel = options
      .filter((option) => option.value !== FRENCH_LANGUAGE)
      .sort((option) => option.label);

    const frenchLanguageOption = options.find((option) => option.value === FRENCH_LANGUAGE);

    return [frenchLanguageOption, ...optionsWithoutFrSortedByLabel];
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
