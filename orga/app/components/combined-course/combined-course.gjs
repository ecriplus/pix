import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import ActivityType from 'pix-orga/components/activity-type';
import CopyPasteButton from 'pix-orga/components/copy-paste-button';
import Breadcrumb from 'pix-orga/components/ui/breadcrumb';
import PageTitle from 'pix-orga/components/ui/page-title';

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
  </template>
}
