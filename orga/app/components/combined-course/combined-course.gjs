import PixIndicatorCard from '@1024pix/pix-ui/components/pix-indicator-card';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import ActivityType from 'pix-orga/components/activity-type';
import CopyPasteButton from 'pix-orga/components/copy-paste-button';
import Breadcrumb from 'pix-orga/components/ui/breadcrumb';
import PageTitle from 'pix-orga/components/ui/page-title';
import ParticipationStatus from 'pix-orga/components/ui/participation-status';

export default class CombinedCourse extends Component {
  @service intl;
  @service currentUser;

  get breadcrumbLinks() {
    return [
      {
        route: 'authenticated.campaigns',
        label: this.intl.t('navigation.main.campaigns'),
      },
      {
        label: this.args.model.name,
      },
    ];
  }

  <template>
    <PageTitle>
      <:breadcrumb>
        <Breadcrumb @links={{this.breadcrumbLinks}} class="campaign-header-title__breadcrumb" />
      </:breadcrumb>
      <:title>
        <ActivityType @big={{true}} @type="COMBINED_COURSE" @hideLabel={{true}} />
        <span class="page-title__name">{{@model.name}}</span>
      </:title>
      <:subtitle>

        <p class="campaign-page__page-subtext">{{t "pages.combined-course.introduction"}}</p>

      </:subtitle>
      <:tools>
        <dl class="campaign-header-title__details">

          <div class="campaign-header-title__detail-item">
            <dt class="label-text">
              {{t "pages.campaign.code"}}
            </dt>
            <dd class="campaign-header-title__campaign-code">
              <span>{{@model.code}}</span>
              <CopyPasteButton
                @clipBoardtext={{@model.code}}
                @successMessage={{t "pages.campaign.copy.code.success"}}
                @defaultMessage={{t "pages.campaign.copy.code.default"}}
                class="hide-on-mobile"
              />
            </dd>
          </div>
        </dl>
      </:tools>
    </PageTitle>

    <div class="combined-course-page__statistics">
      <PixIndicatorCard
        @title={{t "pages.combined-course.statistics.total-participations"}}
        @iconName="users"
        @color="purple"
      >
        <:default>{{@model.combinedCourseStatistics.participationsCount}}</:default>
      </PixIndicatorCard>

      <PixIndicatorCard
        @title={{t "pages.combined-course.statistics.completed-participations"}}
        @iconName="inboxIn"
        @color="green"
      >
        <:default>{{@model.combinedCourseStatistics.completedParticipationsCount}}</:default>
      </PixIndicatorCard>
    </div>

    <PixTable
      @variant="orga"
      @caption={{t "pages.combined-course.table.description"}}
      @data={{@model.combinedCourseParticipations}}
      class="table"
    >
      <:columns as |participation context|>
        <PixTableColumn @context={{context}}>
          <:header>
            {{t "pages.combined-course.table.column.last-name"}}
          </:header>
          <:cell>
            {{participation.lastName}}
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t "pages.combined-course.table.column.first-name"}}
          </:header>
          <:cell>
            {{participation.firstName}}
          </:cell>
        </PixTableColumn>

        <PixTableColumn @context={{context}}>
          <:header>
            {{t "pages.combined-course.table.column.status"}}
          </:header>
          <:cell>
            <ParticipationStatus @status={{participation.status}} />
          </:cell>
        </PixTableColumn>
      </:columns>
    </PixTable>
  </template>
}
