import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import languages from 'mon-pix/languages';

const FRENCH_LANGUAGE = 'fr';

export default class LanguageSwitcher extends Component {
  <template>
    <PixSelect
      ...attributes
      class="language-switcher"
      @id="language-switcher"
      @iconName="globe"
      @value={{this.selectedLanguage}}
      @options={{this.availableLanguages}}
      @onChange={{this.onChange}}
      @hideDefaultOption="true"
      @screenReaderOnly="true"
    >
      <:label>{{t "pages.inscription.choose-language-aria-label"}}</:label>
    </PixSelect>
  </template>
  availableLanguages = this.mapToOptions(languages);

  get selectedLanguage() {
    return this.args.selectedLanguage;
  }

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
}
