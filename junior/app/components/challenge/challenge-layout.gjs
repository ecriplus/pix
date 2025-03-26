import Component from '@glimmer/component';

import WidthLimitedContent from '../width-limited-content';

export default class ChallengeLayout extends Component {
  get className() {
    return this.args.color ?? 'default';
  }

  <template>
    <div class="challenge-layout challenge-layout--{{this.className}}">
      <WidthLimitedContent>{{yield}}</WidthLimitedContent>
    </div>
  </template>
}
