import PixToggleButton from '@1024pix/pix-ui/components/pix-toggle-button';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';

import AnalysisPerCompetence from './analysis-per-competence';
import AnalysisPerTube from './analysis-per-tube';

export default class AnalysisPerTubeOrCompetence extends Component {
  @service intl;
  @tracked displayAnalysisPerTube = true;

  @action
  toggleDisplayAnalysisPerTube() {
    this.displayAnalysisPerTube = !this.displayAnalysisPerTube;
  }

  <template>
    <div class="analysis-per-tube-or-competence__header">
      <h2>
        {{t "components.analysis-per-tube-or-competence.title"}}
      </h2>

      <PixToggleButton
        @inlineLabel={{true}}
        @onChange={{this.toggleDisplayAnalysisPerTube}}
        @toggled={{this.displayAnalysisPerTube}}
      >
        <:label>{{t "components.analysis-per-tube-or-competence.toggle.label"}}</:label>
        <:viewA>{{t "components.analysis-per-tube-or-competence.toggle.label-tubes"}}</:viewA>
        <:viewB>{{t "components.analysis-per-tube-or-competence.toggle.label-competences"}}</:viewB>
      </PixToggleButton>
    </div>

    {{#if this.displayAnalysisPerTube}}
      <AnalysisPerTube @data={{@data}} />
    {{else}}
      <AnalysisPerCompetence @data={{@data}} />
    {{/if}}
  </template>
}
