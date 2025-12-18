import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import { htmlUnsafe } from '../../../helpers/html-unsafe';
import didInsert from '../../../modifiers/modifier-did-insert';
import ModulixIssueReportModal from '../issue-report/issue-report-modal';
import ModuleElement from './module-element';

export default class ModulixCustomDraft extends ModuleElement {
  @service featureToggles;

  @tracked showModal = false;

  get heightStyle() {
    return htmlUnsafe(`height: ${this.args.customDraft.height}px`);
  }

  @action
  setIframeHtmlElement(htmlElement) {
    this.iframe = htmlElement;
  }

  @action
  resetEmbed() {
    this.iframe.setAttribute('src', this.args.customDraft.url);
    this.iframe.focus();
  }

  @action
  onReportClick() {
    this.showModal = true;
  }

  @action
  hideModal() {
    this.showModal = false;
  }

  <template>
    <div class="element-custom-draft element-custom">
      {{#if @customDraft.instruction}}
        <div class="element-custom-draft__instruction">
          {{htmlUnsafe @customDraft.instruction}}
        </div>
      {{/if}}

      <fieldset class="element-custom-draft__container">
        <legend class="element-custom__legend">
          <PixIcon @name="leftClick" @plainIcon={{false}} @ariaHidden={{true}} />
          <span>{{t "pages.modulix.interactiveElement.label"}}</span>
        </legend>

        <iframe
          class="element-custom-draft__iframe"
          src={{@customDraft.url}}
          title={{@customDraft.title}}
          style={{this.heightStyle}}
          {{didInsert this.setIframeHtmlElement}}
        ></iframe>
      </fieldset>

      <div class="element-custom-draft__buttons">
        <PixButton
          class="element-custom-draft-buttons__retry"
          @iconBefore="refresh"
          @variant="tertiary"
          @triggerAction={{this.resetEmbed}}
          aria-label="{{t 'pages.modulix.buttons.interactive-element.reset.ariaLabel'}}"
        >{{t "pages.modulix.buttons.interactive-element.reset.name"}}</PixButton>

        {{#if this.featureToggles.featureToggles.isModulixIssueReportDisplayed}}
          <PixButton
            @variant="tertiary"
            @iconBefore="flag"
            @triggerAction={{this.onReportClick}}
            aria-label={{t "pages.modulix.issue-report.aria-label"}}
          >{{t "pages.modulix.issue-report.button"}}</PixButton>

          <ModulixIssueReportModal @showModal={{this.showModal}} @hideModal={{this.hideModal}} />
        {{/if}}
      </div>
    </div>
  </template>
}
