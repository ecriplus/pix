import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import Card from 'mon-pix/components/tutorials/card';

export default class LearningMorePanel extends Component {
  <template>
    {{#if this.hasLearningMoreItems}}
      <div class="learning-more-panel">
        <div class="learning-more-panel__container">
          <h3 class="learning-more-panel__hint-title"><span>{{t "pages.learning-more.title"}}</span></h3>
          <ul class="learning-more-panel__list-container">
            {{#each @learningMoreTutorials as |learningMoreTutorial|}}
              <Card @tutorial={{learningMoreTutorial}} />
            {{/each}}
            <div class="learning-more-panel__tutorial-info">{{t "pages.learning-more.info"}}</div>
          </ul>
        </div>
      </div>
    {{/if}}
  </template>
  @service featureToggles;

  get hasLearningMoreItems() {
    const learningMoreTutorials = this.args.learningMoreTutorials || [];
    return learningMoreTutorials.length > 0;
  }
}
