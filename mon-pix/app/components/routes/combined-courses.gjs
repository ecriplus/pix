import PixButton from '@1024pix/pix-ui/components/pix-button';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import eq from 'ember-truth-helpers/helpers/eq';

import CombinedCourseItem from '../combined-course/combined-course-item';

export default class CombinedCourses extends Component {
  <template>
    <div class="combined-course">
      {{#if (eq @combinedCourse.status "NOT_STARTED")}}
        <PixButton
          @type="submit"
          @triggerAction={{this.startQuestParticipation}}
          @loading-color="white"
          @size="large"
        >{{t "pages.combined-courses.content.start-button"}}
        </PixButton>
      {{/if}}
      <div class="combined-course__divider" />
      {{#each @combinedCourse.items as |item|}}
        <CombinedCourseItem @item={{item}} @isLocked={{eq @combinedCourse.status "NOT_STARTED"}} />
      {{/each}}
    </div>
  </template>

  @service currentUser;
  @service session;
  @service featureToggles;
  @service intl;
  @service store;

  @action
  async startQuestParticipation() {
    const combinedCourseAdapter = this.store.adapterFor('combined-course');
    await combinedCourseAdapter.start(this.args.combinedCourse.code);
    this.args.combinedCourse.reload();
  }
}
