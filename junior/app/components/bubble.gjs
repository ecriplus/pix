import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import MarkdownToHtml from 'junior/components/markdown-to-html';
import * as markdownConverter from 'junior/utils/markdown-converter';

import OralizationButton from './oralization-button';

export default class Bubble extends Component {
  @tracked display = false;

  constructor() {
    super(...arguments);
    setTimeout(() => {
      this.display = true;
    }, this.args.shouldDisplayIn);
  }
  get getClasses() {
    let className = 'bubble';
    if (this.args.status) {
      className += ` bubble--${this.args.status}`;
    }
    return className;
  }
  get getDelayedClass() {
    if (typeof this.args.shouldDisplayIn === 'number') {
      return 'bubble-container__delayed';
    }
    return '';
  }

  get textToRead() {
    const parser = new DOMParser();
    const parsedText = parser.parseFromString(markdownConverter.toHTML(this.args.message), 'text/html').body.innerText;
    return parsedText;
  }

  <template>
    <div class="bubble-container {{this.getDelayedClass}} {{if this.display 'display' ''}}">
      <MarkdownToHtml ...attributes @markdown={{@message}} @class={{this.getClasses}} />
      {{#if @oralization}}
        <OralizationButton @text={{this.textToRead}} />
      {{/if}}
    </div>
  </template>
}
