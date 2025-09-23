import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import { and, eq } from 'ember-truth-helpers';
import ENV from 'mon-pix/config/environment';

import CombinedCourseItem from '../combined-course/combined-course-item';

const CompletedText = <template>
  <div class="completed-text">
    <h2 class="completed-text__title">{{t "pages.combined-courses.completed.title"}}</h2>
    <p class="completed-text__description">{{t "pages.combined-courses.completed.description"}}</p>
  </div>
</template>;

const Header = <template>
  <header class="combined-course-header">
    <div class="combined-course-header__text">
      <h1>{{@combinedCourse.name}}</h1>

      {{#if (eq @combinedCourse.status "COMPLETED")}}
        <div class="combined-course-completed">
          <img src="/images/illustrations/combined-course/completed.svg" alt="" role="presentation" />
          <CompletedText />
        </div>
      {{/if}}

      <div class={{unless (eq @combinedCourse.status "COMPLETED") "combined-course__description"}}>
        {{@combinedCourse.description}}
      </div>

      {{#if (eq @combinedCourse.status "NOT_STARTED")}}
        <PixButton @type="submit" @triggerAction={{@startQuestParticipation}} @loading-color="white" @size="large">{{t
            "pages.combined-courses.content.start-button"
          }}
        </PixButton>
      {{else if (eq @combinedCourse.status "STARTED")}}
        <PixButton @type="submit" @triggerAction={{@goToNextItem}} @loading-color="white" @size="large">{{t
            "pages.combined-courses.content.resume-button"
          }}
        </PixButton>
      {{/if}}
      {{#if (and (eq @combinedCourse.status "COMPLETED") @isSurveyEnabled)}}
        <PixTooltip @id="tooltip-satisfaction-survey" @position="right" @isWide={{true}}>
          <:triggerElement>
            <PixButtonLink
              @href={{@surveyLink}}
              target="_blank"
              rel="noopener noreferrer"
              @size="large"
              class="survey-button"
            >{{t "pages.combined-courses.completed.survey-button"}}</PixButtonLink>
          </:triggerElement>
          <:tooltip>
            <span>{{t "pages.combined-courses.completed.survey-button-description"}}</span>
          </:tooltip>
        </PixTooltip>

      {{/if}}
    </div>
    <img alt="" role="presentation" src={{@combinedCourse.illustration}} width="320" />
  </header>
</template>;

export default class CombinedCourses extends Component {
  <template>
    <section class="combined-course">
      <div class="combined-course__exit">
        <PixButtonLink @variant="tertiary" @route="authenticated" @iconAfter="doorOpen">
          {{t "common.actions.quit"}}
        </PixButtonLink>
      </div>
      <Header
        @combinedCourse={{@combinedCourse}}
        @startQuestParticipation={{this.startQuestParticipation}}
        @goToNextItem={{this.goToNextItem}}
        @isSurveyEnabled={{this.isSurveyEnabled}}
        @surveyLink={{this.surveyLink}}
      />
      <div class="combined-course__divider" />
      {{#each @combinedCourse.items as |item|}}
        <CombinedCourseItem
          @item={{item}}
          @isLocked={{item.isLocked}}
          @isNextItemToComplete={{eq @combinedCourse.nextCombinedCourseItem item}}
          @onClick={{if (eq @combinedCourse.status "NOT_STARTED") this.startQuestParticipation noop}}
        />
      {{/each}}
    </section>
  </template>

  @service currentUser;
  @service session;
  @service featureToggles;
  @service intl;
  @service store;
  @service router;

  @action
  async startQuestParticipation(e) {
    e.preventDefault();
    const combinedCourseAdapter = this.store.adapterFor('combined-course');
    await combinedCourseAdapter.start(this.args.combinedCourse.code);
    this.goToNextItem();
  }

  @action
  goToNextItem() {
    const item = this.args.combinedCourse.nextCombinedCourseItem;
    this.router.transitionTo(item.route, item.reference, { queryParams: { redirection: item.redirection } });
  }

  get isSurveyEnabled() {
    return this.featureToggles.featureToggles?.isSurveyEnabledForCombinedCourses;
  }

  get surveyLink() {
    return ENV.APP.COMBINIX_SURVEY_LINK;
  }
}

function noop() {}
