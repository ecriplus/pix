import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { and, gt } from 'ember-truth-helpers';

import Chevron from '../../ui/chevron';
import RecommendationIndicator from './recommendation-indicator';
import TubeRecommendationDetail from './tube-recommendation-detail';
import TutorialCounter from './tutorial-counter';

export default class TubeRecommendationRowComponent extends Component {
  @tracked
  isOpenRecommandationTube = false;

  @action
  toggleTutorialsSection() {
    this.isOpenRecommandationTube = !this.isOpenRecommandationTube;
  }

  <template>
    <PixTableColumn @context={{@context}}>
      <:header>
        {{t "pages.campaign-review.table.analysis.column.subjects" count=@count}}
      </:header>
      <:cell>
        <span class="competences-col__border competences-col__border--{{@tubeRecommendation.areaColor}}">
          <span class="tube-recommendation-title">
            {{@tubeRecommendation.tubePracticalTitle}}
          </span>
          <sub class="tube-recommendation-subtitle">
            {{@tubeRecommendation.competenceName}}
          </sub>

          {{#if (and (gt @tubeRecommendation.tutorials.length 0) this.isOpenRecommandationTube)}}
            <TubeRecommendationDetail @tubeRecommendation={{@tubeRecommendation}} />
          {{/if}}
        </span>
      </:cell>
    </PixTableColumn>

    <PixTableColumn
      @context={{@context}}
      @type="number"
      @sortOrder={{@order}}
      @onSort={{@sortRecommendationOrder}}
      @ariaLabelDefaultSort={{t "pages.campaign-review.table.analysis.column.relevance.ariaLabelDefaultSort"}}
      @ariaLabelSortAsc={{t "pages.campaign-review.table.analysis.column.relevance.ariaLabelSortUp"}}
      @ariaLabelSortDesc={{t "pages.campaign-review.table.analysis.column.relevance.ariaLabelSortDown"}}
    >
      <:header>
        {{t "pages.campaign-review.table.competences.column.results.label"}}
      </:header>
      <:cell>
        <RecommendationIndicator @value={{@tubeRecommendation.averageScore}} />
      </:cell>
    </PixTableColumn>

    <PixTableColumn @context={{@context}}>
      <:header>
        {{t "pages.campaign-review.table.analysis.column.tutorial-count.aria-label"}}
      </:header>
      <:cell>
        <TutorialCounter @tutorials={{@tubeRecommendation.tutorials}} />
      </:cell>
    </PixTableColumn>

    <PixTableColumn @context={{@context}}>
      <:header>
        {{t "common.actions.global"}}
      </:header>
      <:cell>
        {{#if (gt @tubeRecommendation.tutorials.length 0)}}
          <Chevron
            @isOpen={{this.isOpenRecommandationTube}}
            @onClick={{this.toggleTutorialsSection}}
            @ariaLabel={{t "pages.campaign-review.table.analysis.column.tutorial.aria-label"}}
          />
        {{/if}}
      </:cell>
    </PixTableColumn>
  </template>
}
