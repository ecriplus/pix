import Component from '@glimmer/component';
import MarkdownToHtml from 'mon-pix/components/markdown-to-html';

export default class FormattedSolution extends Component {
  get displayedSolution() {
    if (typeof this.args.solutionToDisplay === 'number') return `${this.args.solutionToDisplay}`;
    return this.args.solutionToDisplay?.replaceAll('\n', ' <br>');
  }

  <template><MarkdownToHtml ...attributes @markdown={{this.displayedSolution}} /></template>
}
