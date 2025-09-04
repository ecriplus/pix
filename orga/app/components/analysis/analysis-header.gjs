import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixToggleButton from '@1024pix/pix-ui/components/pix-toggle-button';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import { not } from 'ember-truth-helpers';
import GlobalPositioning from 'pix-orga/components/analysis/global-positioning';

const levels = [
  'pages.campaign-analysis.levels-correspondence.levels.beginner',
  'pages.campaign-analysis.levels-correspondence.levels.independent',
  'pages.campaign-analysis.levels-correspondence.levels.advanced',
  'pages.campaign-analysis.levels-correspondence.levels.expert',
];

export default class Analysis extends Component {
  @service intl;
  @service router;

  get displayAnalysisPerTube() {
    return this.router.currentRouteName.endsWith('competences');
  }

  @action
  toggleDisplayAnalysisPerTube() {
    const targetRoute = this.displayAnalysisPerTube
      ? 'authenticated.campaigns.campaign.analysis.tubes'
      : 'authenticated.campaigns.campaign.analysis.competences';

    this.router.transitionTo(targetRoute).then(() => {
      window.location.hash = 'details';
    });
  }
  <template>
    <h2 class="result-analysis__title">{{t "pages.campaign-analysis.second-title"}}</h2>
    <div class="analysis-description">
      <b class="analysis-description__resume">{{t "pages.campaign-analysis.description.resume"}}</b>
      <p>{{t "pages.campaign-analysis.description.explanation"}}</p>
      <p>{{t "pages.campaign-analysis.description.nota-bene"}}</p>
    </div>
    <div class="result-analysis__global-information">
      <GlobalPositioning @data={{@model.analysisData}} />
      <PixBlock class="result-analysis__global-positioning-explanation" @variant="orga">
        <h2 id="details" class="global-positioning__title">{{t
            "pages.campaign-analysis.levels-correspondence.title"
          }}</h2>
        <ul>
          {{#each levels as |levelKey|}}
            <li>{{t levelKey}}</li>
          {{/each}}
        </ul>
        <br />
        <a
          href={{t "pages.campaign-analysis.levels-correspondence.infos.link"}}
          target="_blank"
          rel="noopener noreferrer"
          class="link link--banner link--underlined"
        >
          {{t "pages.campaign-analysis.levels-correspondence.infos.text"}}</a>
      </PixBlock>
    </div>
    <div class="analysis-per-tube-or-competence__header">
      <h2>
        {{t "components.analysis-per-tube-or-competence.title"}}
      </h2>

      <PixToggleButton
        @inlineLabel={{true}}
        @onChange={{this.toggleDisplayAnalysisPerTube}}
        @toggled={{not this.displayAnalysisPerTube}}
      >
        <:label>{{t "components.analysis-per-tube-or-competence.toggle.label"}}</:label>
        <:viewA>{{t "components.analysis-per-tube-or-competence.toggle.label-tubes"}}</:viewA>
        <:viewB>{{t "components.analysis-per-tube-or-competence.toggle.label-competences"}}</:viewB>
      </PixToggleButton>
    </div>
  </template>
}
