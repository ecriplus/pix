import Component from '@glimmer/component';
import MarkdownToHtml from 'mon-pix/components/markdown-to-html';
import htmlUnsafe from 'mon-pix/helpers/html-unsafe';

export default class FormattedSolution extends Component {
  get displayedSolution() {
    if (typeof this.args.solutionToDisplay === 'number') return `${this.args.solutionToDisplay}`;
    return this.args.solutionToDisplay?.replaceAll('\n', ' <br>');
  }

  <template>
    {{#if @isMarkdown}}
      <MarkdownToHtml ...attributes @markdown={{this.displayedSolution}} />
    {{else}}
      <span ...attributes>
        {{htmlUnsafe this.displayedSolution}}
      </span>
    {{/if}}
  </template>
}
