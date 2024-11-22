import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

export default class DelayedElement extends Component {
  @tracked display = false;

  constructor() {
    super(...arguments);

    if (this.args.shouldDisplayIn > 0) {
      setTimeout(() => {
        this.display = true;
      }, this.args.shouldDisplayIn);
    } else {
      this.display = true;
    }
  }

  <template>
    <section class="element-delayed-wrapper {{if this.display 'display' ''}}">
      {{#if this.display}}
        {{yield}}
      {{/if}}
    </section>
  </template>
}
