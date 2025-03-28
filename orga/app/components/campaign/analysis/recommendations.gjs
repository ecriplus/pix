import PixTable from '@1024pix/pix-ui/components/pix-table';
import { action } from '@ember/object';
import { service } from '@ember/service';
import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import TubeRecommendationRow from './tube-recommendation-row';

export default class Recommendations extends Component {
  @service intl;
  @tracked sortedRecommendations;
  @tracked order = null;

  constructor() {
    super(...arguments);

    Promise.resolve(this.args.campaignTubeRecommendations).then((recommendations) => {
      this.sortedRecommendations = recommendations
        ? recommendations.slice().sort((a, b) => {
            return a.averageScore - b.averageScore;
          })
        : [];
    });
  }

  @action
  async sortRecommendationOrder() {
    const campaignTubeRecommendations = this.sortedRecommendations.slice();

    if (!this.sortedRecommendations) {
      return null;
    } else if (this.order === 'desc') {
      this.order = 'asc';
      this.sortedRecommendations = campaignTubeRecommendations.sort((a, b) => {
        return a.averageScore - b.averageScore;
      });
    } else {
      this.order = 'desc';
      this.sortedRecommendations = campaignTubeRecommendations.sort((a, b) => {
        return b.averageScore - a.averageScore;
      });
    }
  }

  get description() {
    return htmlSafe(
      this.intl.t('pages.campaign-review.description', {
        bubble:
          '<span aria-hidden="true" focusable="false">(<svg height="10" width="10" role="img"><circle cx="5" cy="5" r="5" class="campaign-details-analysis recommendation-indicator__bubble" /></svg>)</span>',
      }),
    );
  }

  <template>
    <section>
      <h3 class="campaign-details-analysis__header">
        {{t "pages.campaign-review.sub-title"}}
      </h3>
      <p class="campaign-details-analysis__text">
        {{this.description}}
      </p>
      <PixTable
        @condensed={{true}}
        @variant="orga"
        @caption={{t "pages.campaign-review.table.analysis.caption"}}
        @data={{this.sortedRecommendations}}
        class="table"
      >
        <:columns as |tubeRecommendation context|>
          <TubeRecommendationRow
            @tubeRecommendation={{tubeRecommendation}}
            @context={{context}}
            @count={{this.sortedRecommendations.length}}
            @order={{this.order}}
            @sortRecommendationOrder={{this.sortRecommendationOrder}}
          />
        </:columns>
      </PixTable>

      {{#unless @displayAnalysis}}
        <div class="table__empty content-text">{{t "pages.campaign-review.table.empty"}}</div>
      {{/unless}}
    </section>
  </template>
}
