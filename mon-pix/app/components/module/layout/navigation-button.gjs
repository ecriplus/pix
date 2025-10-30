import onEscapeAction from '@1024pix/pix-ui/addon/modifiers/on-escape-action';
import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import PixNavigationButton from '@1024pix/pix-ui/components/pix-navigation-button';
import { concat } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { SECTION_TITLE_ICONS } from 'mon-pix/models/section';

export default class ModulixNavigationButton extends Component {
  @service intl;
  @service media;

  @tracked isTooltipVisible = false;

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

  get isDisabled() {
    return !this.args.isPastSection && !this.args.isCurrentSection;
  }

  get isCurrentSection() {
    return this.args.isCurrentSection;
  }

  @action
  dummyFunction() {}

  @action
  showTooltip() {
    this.isTooltipVisible = true;
  }

  @action
  hideTooltip() {
    setTimeout(() => (this.isTooltipVisible = false));
  }

  @action
  hideTooltipOnMouseOut(event) {
    const isFocused = event.target.contains(document.activeElement);

    if (isFocused) {
      return;
    }

    this.hideTooltip(event);
  }

  <template>
    {{#if this.media.isMobile}}
      <PixNavigationButton
        class="module-navigation-mobile-button module-navigation-mobile-button{{this.buttonClass}}"
        href={{concat "#section_" @section.type}}
        @icon={{this.sectionTitleIcon @section.type}}
        aria-disabled="{{this.isDisabled}}"
        aria-current="{{this.isCurrentSection}}"
      >{{this.sectionTitle @section.type}}</PixNavigationButton>
    {{else}}
      <div
        class="navigation-tooltip {{if this.isTooltipVisible 'navigation-tooltip--visible' ''}}"
        {{onEscapeAction this.hideTooltip}}
        {{on "mouseleave" this.hideTooltipOnMouseOut}}
        {{on "mouseenter" this.showTooltip}}
        {{on "focusin" this.showTooltip}}
        {{on "focusout" this.hideTooltip}}
      >
        <PixIconButton
          class="module-navigation-button module-navigation-button{{this.buttonClass}}"
          @ariaLabel={{this.sectionTitle @section.type}}
          @triggerAction={{this.dummyFunction}}
          @iconName={{this.sectionTitleIcon @section.type}}
          @isDisabled={{this.isDisabled}}
          aria-current="{{this.isCurrentSection}}"
        />
        <span role="tooltip" class="navigation-tooltip__content navigation-tooltip__content{{this.buttonClass}}">
          {{this.sectionTitle @section.type}}
        </span>
      </div>
    {{/if}}
  </template>
}
