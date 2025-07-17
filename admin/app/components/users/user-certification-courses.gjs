import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import { t } from 'ember-intl';

export default class UserCertificationCourses extends Component {
  @service intl;
  @service router;
  @service store;

  @tracked userCertificationCourses = [];

  constructor() {
    super(...arguments);

    this.loadUserCertificationCourses();
  }

  async loadUserCertificationCourses() {
    const userId = this.router.currentRoute.parent.params.user_id;
    this.userCertificationCourses = await this.store.query('user-certification-course', { userId });
  }

  <template>
    <header class="page-section__header">
      <h2 class="page-section__title">
        {{t "components.users.certification-centers.certification-courses.section-title"}}
      </h2>
    </header>

    {{#if this.userCertificationCourses.length}}
      <PixTable
        @variant="admin"
        @data={{this.userCertificationCourses}}
        @caption={{t "components.users.certification-centers.certification-courses.table-caption"}}
      >
        <:columns as |certificationCourse context|>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "components.users.certification-centers.certification-courses.table-headers.id"}}
            </:header>
            <:cell>
              <LinkTo
                @route="authenticated.certifications.certification.informations"
                @model={{certificationCourse.id}}
              >
                {{certificationCourse.id}}
              </LinkTo>
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "components.users.certification-centers.certification-courses.table-headers.created-at"}}
            </:header>
            <:cell>
              {{dayjsFormat certificationCourse.createdAt "DD/MM/YYYY"}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "components.users.certification-centers.certification-courses.table-headers.session-id"}}
            </:header>
            <:cell>
              <LinkTo @route="authenticated.sessions.session.informations" @model={{certificationCourse.sessionId}}>
                {{certificationCourse.sessionId}}
              </LinkTo>
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "components.users.certification-centers.certification-courses.table-headers.session-status"}}
            </:header>
            <:cell>
              {{#if certificationCourse.isPublished}}
                {{t "pages.certifications.session-state.published"}}
              {{else}}
                {{t "pages.certifications.session-state.not-published"}}
              {{/if}}
            </:cell>
          </PixTableColumn>
        </:columns>
      </PixTable>
    {{else}}
      <div class="table__empty">{{t "components.users.certification-centers.certification-courses.empty-table"}}</div>
    {{/if}}
  </template>
}
