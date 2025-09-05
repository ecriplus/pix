import PixButton from '@1024pix/pix-ui/components/pix-button';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import eq from 'ember-truth-helpers/helpers/eq';

import CombinedCourseItem from '../combined-course/combined-course-item';

const CompletedText = <template>
  <div class="completed-text" ...attributes>
    <h2 class="completed-text__title">{{t "pages.combined-courses.completed.title"}}</h2>
    <p class="completed-text__description">{{t "pages.combined-courses.completed.description"}}</p>
  </div>
</template>;

export default class CombinedCourses extends Component {
  <template>
    <div class="combined-course">
      <div class="combined-course__header">
        <h1>{{@combinedCourse.name}} </h1>
      </div>
      {{#if (eq @combinedCourse.status "COMPLETED")}}
        <section class="combined-course-completed">
          <img src="/images/illustrations/combined-course/completed.svg" />
          <CompletedText />
        </section>
      {{else if (eq @combinedCourse.status "NOT_STARTED")}}
        <PixButton
          @type="submit"
          @triggerAction={{this.startQuestParticipation}}
          @loading-color="white"
          @size="large"
        >{{t "pages.combined-courses.content.start-button"}}
        </PixButton>
      {{else if (eq @combinedCourse.status "STARTED")}}
        <PixButton @type="submit" @triggerAction={{this.goToNextItem}} @loading-color="white" @size="large">{{t
            "pages.combined-courses.content.resume-button"
          }}
        </PixButton>
      {{/if}}
      <div class="combined-course__divider" />
      {{#each @combinedCourse.items as |item|}}
        <CombinedCourseItem
          @item={{item}}
          @isLocked={{item.isLocked}}
          @isNextItemToComplete={{eq @combinedCourse.nextCombinedCourseItem item}}
          @onClick={{if (eq @combinedCourse.status "NOT_STARTED") this.startQuestParticipation noop}}
        />
      {{/each}}
    </div>
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
}
function noop() {}
