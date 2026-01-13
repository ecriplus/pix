import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixSegmentedControl from '@1024pix/pix-ui/components/pix-segmented-control';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
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

  get isToggleSwitched() {
    return this.router.currentRouteName.endsWith('competences');
  }

  @action
  toggleDisplayAnalysisPerCompetences(displayPerCompetence) {
    const targetRoute = displayPerCompetence
      ? 'authenticated.campaigns.campaign.analysis.competences'
      : 'authenticated.campaigns.campaign.analysis.tubes';

    this.router.transitionTo(targetRoute).then(() => {
      window.location.hash = 'details';
    });
  }
  <template>
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

      <PixSegmentedControl
        @inlineLabel={{true}}
        @onChange={{this.toggleDisplayAnalysisPerCompetences}}
        @variant="orga"
        @toggled={{this.isToggleSwitched}}
      >
        <:label>{{t "components.analysis-per-tube-or-competence.toggle.label"}}</:label>
        <:viewA>{{t "components.analysis-per-tube-or-competence.toggle.label-tubes"}}</:viewA>
        <:viewB>{{t "components.analysis-per-tube-or-competence.toggle.label-competences"}}</:viewB>
      </PixSegmentedControl>
    </div>
  </template>
}
