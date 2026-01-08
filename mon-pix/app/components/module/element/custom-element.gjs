import { metadata } from '@1024pix/epreuves-components/metadata';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import htmlUnsafe from 'mon-pix/helpers/html-unsafe';
import didInsert from 'mon-pix/modifiers/modifier-did-insert';

import ModulixIssueReportBlock from '../issue-report/issue-report-block';
import ModuleElement from './module-element';

export default class ModulixCustomElement extends ModuleElement {
  @tracked
  customElement;

  @tracked reportInfo = { answer: null, elementId: this.args.component.id, elementType: this.args.component.type };

  @tracked
  resetButtonDisplayed = false;

  @action
  mountCustomElement(container) {
    this.customElement = document.createElement(this.args.component.tagName);

    const props = this.customElement.normalizeProps?.(this.args.component.props) ?? this.args.component.props;

    Object.assign(this.customElement, props);
    container.append(this.customElement);

    if (this.customElement.reset !== undefined) {
      this.resetButtonDisplayed = true;
    }
  }

  @action
  resetCustomElement() {
    this.customElement.reset();
  }

  get isInteractive() {
    if (metadata[this.args.component.tagName] !== undefined) {
      return metadata[this.args.component.tagName].isInteractive;
    } else {
      return true;
    }
  }

  get hasInstruction() {
    return this.args.component.instruction?.length > 0;
  }

  <template>
    <div class="element-custom">
      {{#if this.hasInstruction}}
        <div class="element-custom__instruction">
          {{htmlUnsafe @component.instruction}}
        </div>
      {{/if}}

      {{#if this.isInteractive}}
        <fieldset
          class="element-custom__container
            {{if this.resetButtonDisplayed 'element-custom--reset-intercative-state' ''}}"
        >
          <legend class="element-custom__legend">
            <PixIcon @name="leftClick" @plainIcon={{false}} @ariaHidden={{true}} />
            <span>{{t "pages.modulix.interactiveElement.label"}}</span>
          </legend>
          <div {{didInsert this.mountCustomElement}} />
        </fieldset>
      {{else}}
        <div
          class="element-custom__container {{if this.resetButtonDisplayed 'element-custom--reset-state'}}"
          {{didInsert this.mountCustomElement}}
        />
      {{/if}}

      <div class={{if this.resetButtonDisplayed "element-custom__buttons" "element-custom__button"}}>
        {{#if this.resetButtonDisplayed}}
          <PixButton
            class="element-custom-buttons__reset"
            @iconBefore="refresh"
            @variant="tertiary"
            @triggerAction={{this.resetCustomElement}}
            aria-label="{{t 'pages.modulix.buttons.interactive-element.reset.ariaLabel'}}"
          >{{t "pages.modulix.buttons.interactive-element.reset.name"}}</PixButton>
        {{/if}}

        <ModulixIssueReportBlock @reportInfo={{this.reportInfo}} />
      </div>
    </div>
  </template>
}
