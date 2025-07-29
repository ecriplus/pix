import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import t from 'ember-intl/helpers/t';

export default class LocaleSwitcher extends Component {
  @service locale;
  @service router;

  @tracked selectedLocale;

  constructor() {
    super(...arguments);
    this.selectedLocale = this.args.defaultValue || this.locale.currentLocale;
  }

  @action
  onChange(value) {
    this.selectedLocale = value;
    this.locale.setCurrentLocale(value);

    this.router.replaceWith({ queryParams: { lang: null } });

    if (this.args.onChange) {
      this.args.onChange(value);
    }
  }

  <template>
    <PixSelect
      ...attributes
      class="locale-switcher"
      @id="locale-switcher"
      @iconName="globe"
      @value={{this.selectedLocale}}
      @options={{this.locale.switcherDisplayedLanguages}}
      @onChange={{this.onChange}}
      @hideDefaultOption="true"
      @screenReaderOnly="true"
    >
      <:label>{{t "pages.inscription.choose-language-aria-label"}}</:label>
    </PixSelect>
  </template>
}
