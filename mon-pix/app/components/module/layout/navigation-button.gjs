import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import PixNavigationButton from '@1024pix/pix-ui/components/pix-navigation-button';
import { concat } from '@ember/helper';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { SECTION_TITLE_ICONS } from 'mon-pix/models/section';

export default class ModulixNavigationButton extends Component {
  @service intl;
  @service media;

  @action
  sectionTitle(type) {
    return this.intl.t(`pages.modulix.section.${type}`);
  }

  @action
  sectionTitleIcon(type) {
    return SECTION_TITLE_ICONS[type];
  }

  get buttonClass() {
    if (this.args.isCurrentSection) {
      return '--current';
    }
    if (this.args.isPastSection) {
      return '--enabled';
    }
    return '--disabled';
  }

  @action
  dummyFunction() {}

  <template>
    {{#if this.media.isMobile}}
      <PixNavigationButton
        class="module-navigation__mobile-button module-navigation__mobile-button{{this.buttonClass}}"
        href={{concat "#section_" @section.type}}
        @icon={{this.sectionTitleIcon @section.type}}
      >{{this.sectionTitle @section.type}}</PixNavigationButton>
    {{else}}
      <PixIconButton
        class="module-navigation__button module-navigation__button{{this.buttonClass}}"
        @ariaLabel={{this.sectionTitle @section.type}}
        @triggerAction={{this.dummyFunction}}
        @iconName={{this.sectionTitleIcon @section.type}}
      />
    {{/if}}
  </template>
}
