import { service } from '@ember/service';
import Component from '@glimmer/component';
import Breadcrumb from 'pix-orga/components/ui/breadcrumb';
import PageTitle from 'pix-orga/components/ui/page-title';

export default class ParticipationDetail extends Component {
  @service intl;

  get breadcrumbLinks() {
    return [
      {
        route: 'authenticated.campaigns.list.my-campaigns',
        label: this.intl.t('navigation.main.campaigns'),
      },
      {
        route: 'authenticated.campaigns.combined-courses',
        label: this.intl.t('navigation.main.combined-courses'),
      },
      {
        route: 'authenticated.combined-course',
        label: this.args.combinedCourse.name,
        model: this.args.combinedCourse.id,
      },
      {
        label: `Participation de ${this.args.participation.firstName} ${this.args.participation.lastName}`,
      },
    ];
  }

  <template>
    <PageTitle>
      <:breadcrumb>
        <Breadcrumb @links={{this.breadcrumbLinks}} class="campaign-header-title__breadcrumb" />
      </:breadcrumb>
      <:title>
        {{@participation.firstName}}
        {{@participation.lastName}}
      </:title>
    </PageTitle>
  </template>
}
