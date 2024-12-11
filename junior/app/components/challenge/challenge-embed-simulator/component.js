import { action } from '@ember/object';
import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';

export default class ChallengeEmbedSimulator extends Component {
  get embedDocumentHeightStyle() {
    const baseHeight = this.args.height ?? '600';
    const itemMedia = document.getElementsByClassName('challenge-item__media ')[0];
    const height = this.args.isMediaWithForm ? (baseHeight * itemMedia.offsetWidth) / 710 : baseHeight;
    return htmlSafe(`height: ${height}px; max-height: ${baseHeight}px`);
  }

  @action
  setIframeHtmlElement(htmlElement) {
    this.iframe = htmlElement;
  }

  @action
  rebootSimulator() {
    const iframe = this.iframe;
    const tmpSrc = iframe.src;

    const loadListener = () => {
      if (iframe.src === 'about:blank') {
        // First onload: when we reset the iframe
        iframe.src = tmpSrc;
      } else {
        // Second onload: when we re-assign the iframe's src to its original value
        iframe.focus();
        iframe.removeEventListener('load', loadListener);
      }
    };

    iframe.addEventListener('load', loadListener);

    iframe.src = 'about:blank';
  }
}
