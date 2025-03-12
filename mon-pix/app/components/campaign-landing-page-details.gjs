import { service } from '@ember/service';
import Component from '@glimmer/component';

import CampaignStep from './campaigns/assessment/start-landing-page/campaign-step';

export default class CampaignLandingPageDetails extends Component {
  @service intl;

  get steps() {
    return [
      {
        title: this.intl.t('components.campaigns.start-landing-page.steps.step1.title'),
        description: this.intl.t('components.campaigns.start-landing-page.steps.step1.description'),
        image: {
          src: '/images/rocket.svg',
        },
      },
      {
        title: this.intl.t('components.campaigns.start-landing-page.steps.step2.title'),
        description: this.intl.t('components.campaigns.start-landing-page.steps.step2.description'),
        image: { src: '/images/chart.svg' },
      },
      {
        title: this.intl.t('components.campaigns.start-landing-page.steps.step3.title'),
        description: this.intl.t('components.campaigns.start-landing-page.steps.step3.description'),
        image: { src: '/images/book.svg' },
      },
    ];
  }

  <template>
    <div class="campaign-landing-page-details">

      {{#each this.steps as |step|}}
        <CampaignStep @step={{step}} />
      {{/each}}
    </div>
  </template>
}
