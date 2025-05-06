import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import MarkdownToHtml from 'mon-pix/components/markdown-to-html';
import Card from 'mon-pix/components/tutorials/card';

export default class TutorialPanel extends Component {
  <template>
    <div class="tutorial-panel">

      {{#if this.shouldDisplayHintOrTuto}}
        <div class="tutorial-panel__hint-container">
          <h3 class="tutorial-panel__hint-title"><span>{{t "pages.tutorial-panel.title"}}</span></h3>

          {{#if this.shouldDisplayHint}}
            <div class="tutorial-panel__hint-container-body">
              <div class="tutorial-panel__hint-picto-container">
                <img src="/images/icons/comparison-window/icon-lampe.svg" alt class="tutorial-panel__hint-picto" />
              </div>
              <MarkdownToHtml @class="tutorial-panel__hint-content" @markdown={{@hint}} />
            </div>
          {{/if}}

          {{#if this.shouldDisplayTutorial}}
            <ul class="tutorial-panel__tutorials-container">
              {{#each this.limitedTutorials as |tutorial|}}
                <Card @tutorial={{tutorial}} />
              {{/each}}
            </ul>
            <div class="tutorial-panel__tutorial-info">{{t "pages.tutorial-panel.info"}}</div>
          {{/if}}

        </div>

      {{/if}}
    </div>
  </template>
  @service featureToggles;

  get shouldDisplayHintOrTuto() {
    const tutorials = this.args.tutorials || [];
    const hint = this.args.hint || [];

    return hint.length > 0 || tutorials.length > 0;
  }

  get shouldDisplayHint() {
    const hint = this.args.hint || [];
    return hint.length > 0;
  }

  get shouldDisplayTutorial() {
    const tutorials = this.args.tutorials || [];
    return tutorials.length > 0;
  }

  get limitedTutorials() {
    return this.args.tutorials.slice(0, 3);
  }
}
