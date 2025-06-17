import { action } from '@ember/object';
import Component from '@glimmer/component';

import didRender from '../../../modifiers/did-render';

export default class EmbeddedWebComponent extends Component {
  #customElement;
  #handleAnswer = (event) => this.args.setAnswerValue(event.detail[0]);

  @action
  mountCustomElement(container) {
    this.#customElement = document.createElement(this.args.tagName);
    Object.assign(this.#customElement, this.args.props);
    this.#customElement.addEventListener('answer', this.#handleAnswer);
    this.#customElement.dataset.testid = this.args.tagName;
    container.append(this.#customElement);
  }

  willDestroy(...args) {
    super.willDestroy(...args);
    this.#customElement.removeEventListener('answer', this.#handleAnswer);
  }

  <template><div {{didRender this.mountCustomElement}} /></template>
}
