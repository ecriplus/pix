import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import { t } from 'ember-intl';
import ActivityType from 'pix-orga/components/activity-type';

import CopyPasteButton from '../../copy-paste-button';
import Breadcrumb from '../../ui/breadcrumb';
import PageTitle from '../../ui/page-title';

export default class Header extends Component {
  @service intl;
  @service currentUser;

  get breadcrumbLinks() {
    return [
      {
        route: 'authenticated.campaigns',
        label: this.intl.t('navigation.main.campaigns'),
      },
      {
        route: 'authenticated.campaigns.campaign.activity',
        label: this.args.campaign.name,
        model: this.args.campaign.id,
      },
    ];
  }

  get shouldShowMultipleSending() {
    return this.args.campaign.isProfilesCollection || this.isMultipleSendingsForAssessmentEnabled;
  }

  get isMultipleSendingsForAssessmentEnabled() {
    return (
      (this.args.campaign.isTypeAssessment || this.args.campaign.isTypeExam) &&
      this.currentUser.prescriber.enableMultipleSendingAssessment
    );
  }

  get multipleSendingText() {
    return this.args.campaign.multipleSendings
      ? this.intl.t('pages.campaign.multiple-sendings.status.enabled')
      : this.intl.t('pages.campaign.multiple-sendings.status.disabled');
  }

  <template>
    <PageTitle>
      <:breadcrumb>
        <Breadcrumb @links={{this.breadcrumbLinks}} class="campaign-header-title__breadcrumb" />
      </:breadcrumb>
      <:title>
        <ActivityType @big={{true}} @type={{@campaign.type}} @hideLabel={{true}} />
        <span class="page-title__name">{{@campaign.name}}</span>
      </:title>
      <:subtitle>
        {{#if @campaign.isFromCombinedCourse}}
          <p class="campaign-page__page-subtext">
            {{t "pages.campaign.included-in-combined-course"}}
            <LinkTo
              class="link"
              @route="authenticated.combined-course"
              @model={{@campaign.combinedCourse.id}}
            >{{@campaign.combinedCourse.name}}</LinkTo>{{t "pages.campaign.included-in-combined-course-end"}}
          </p>
        {{/if}}
      </:subtitle>
      <:tools>
        <dl class="campaign-header-title__details">
          <div class="campaign-header-title__detail-item hide-on-mobile">
            <dt class="label-text">
              {{t "pages.campaign.created-on"}}
            </dt>
            <dd>
              {{dayjsFormat @campaign.createdAt "DD/MM/YYYY" allow-empty=true}}
            </dd>
          </div>
          <div class="campaign-header-title__detail-item">
            <dt class="label-text">
              {{t "pages.campaign.created-by"}}
            </dt>
            <dd>
              {{@campaign.ownerFullName}}
            </dd>
          </div>

          {{#if this.shouldShowMultipleSending}}
            <div class="campaign-header-title__detail-item">
              <dt class="label-text">
                {{t "pages.campaign.multiple-sendings.title"}}
              </dt>
              <dd>
                {{this.multipleSendingText}}
              </dd>
            </div>
          {{/if}}
          {{#unless @campaign.isFromCombinedCourse}}
            <div class="campaign-header-title__detail-item">
              <dt class="label-text">
                {{t "pages.campaign.code"}}
              </dt>
              <dd class="campaign-header-title__campaign-code">
                <span>{{@campaign.code}}</span>
                <CopyPasteButton
                  @clipBoardtext={{@campaign.code}}
                  @successMessage={{t "pages.campaign.copy.code.success"}}
                  @defaultMessage={{t "pages.campaign.copy.code.default"}}
                  class="hide-on-mobile"
                />
              </dd>
            </div>
          {{/unless}}
        </dl>
      </:tools>
    </PageTitle>
  </template>
}
