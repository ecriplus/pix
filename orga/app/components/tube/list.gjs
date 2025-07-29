import PixAccordions from '@1024pix/pix-ui/components/pix-accordions';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';

import Header from '../table/header';
import Thematic from './thematic';
import Tube from './tube';

export default class TubeList extends Component {
  @tracked selectedTubeIds = [];
  @service dayjs;

  @action
  selectThematic(thematic) {
    thematic.tubes.forEach((tube) => {
      this.selectTube(tube);
    });
  }

  @action
  unselectThematic(thematic) {
    thematic.tubes.forEach((tube) => {
      this.unselectTube(tube);
    });
  }

  @action
  selectTube(tube) {
    if (this.isTubeSelected(tube)) return;
    this.selectedTubeIds = [...this.selectedTubeIds, tube.id];
  }

  @action
  unselectTube(tube) {
    const index = this.selectedTubeIds.indexOf(tube.id);
    if (index === -1) return;
    this.selectedTubeIds.splice(index, 1);

    this.selectedTubeIds = [...this.selectedTubeIds];
  }

  getThematicState = (thematic) => {
    let every = true;
    let some = false;
    thematic.tubes.forEach((tube) => {
      if (this.isTubeSelected(tube)) {
        some = true;
      } else {
        every = false;
      }
    });
    return every ? 'checked' : some ? 'indeterminate' : 'unchecked';
  };

  isTubeSelected = (tube) => {
    return this.selectedTubeIds.includes(tube.id);
  };

  get sortedAreas() {
    return this.args.frameworks
      .map((framework) => framework.sortedAreas)
      .flat()
      .sort((a, b) => {
        return a.code.localeCompare(b.code);
      });
  }

  get haveNoTubeSelected() {
    return this.selectedTubeIds.length === 0;
  }

  get numberOfTubesSelected() {
    return this.selectedTubeIds.length;
  }

  get file() {
    const selectedTubes = this.args.frameworks.slice().flatMap((framework) => {
      return framework.sortedAreas.slice().flatMap((area) => {
        return area.sortedCompetences.slice().flatMap((competence) => {
          return competence.sortedThematics.slice().flatMap((thematic) => {
            return thematic.sortedTubes
              .filter((tube) => this.isTubeSelected(tube))
              .map((tube) => ({
                id: tube.id,
                frameworkId: framework.id,
              }));
          });
        });
      });
    });
    const json = JSON.stringify(selectedTubes);
    return new Blob([json], { type: 'application/json' });
  }

  get fileSize() {
    return (this.file.size / 1024).toFixed(2);
  }

  get formattedCurrentDate() {
    return this.dayjs.self().format('YYYY-MM-DD-HHmm');
  }

  get downloadURL() {
    return URL.createObjectURL(this.file);
  }

  <template>
    <section>
      <div class="download-file">
        {{#if this.haveNoTubeSelected}}
          <PixButton class="download-file__button" @isDisabled={{this.haveNoTubeSelected}}>
            {{t "pages.preselect-target-profile.no-tube-selected" fileSize=this.fileSize}}
          </PixButton>
        {{else}}
          <PixButtonLink
            class="download-file__button"
            @href={{this.downloadURL}}
            download={{t
              "pages.preselect-target-profile.download-filename"
              organizationName=@organization.name
              date=this.formattedCurrentDate
            }}
          >
            {{t
              "pages.preselect-target-profile.download"
              fileSize=this.fileSize
              numberOfTubesSelected=this.numberOfTubesSelected
            }}
          </PixButtonLink>
        {{/if}}
      </div>
      {{#each this.sortedAreas as |area|}}
        <PixAccordions class="{{area.color}}">
          <:title>{{area.code}} · {{area.title}}</:title>
          <:content>
            {{#each area.sortedCompetences as |competence|}}
              <h2>{{competence.index}} {{competence.name}}</h2>
              <table class="table content-text content-text--small preselect-tube-table">
                <caption>{{t "pages.preselect-target-profile.table.caption"}}</caption>
                <thead>
                  <tr>
                    <Header @size="medium" @align="center" scope="col">
                      {{t "pages.preselect-target-profile.table.column.theme-name"}}
                    </Header>
                    <Header @size="wide" scope="col">
                      {{t "pages.preselect-target-profile.table.column.name"}}
                    </Header>
                    <Header @size="small" @align="center" scope="col">
                      {{t "pages.preselect-target-profile.table.column.mobile"}}
                    </Header>
                    <Header @size="small" @align="center" scope="col">
                      {{t "pages.preselect-target-profile.table.column.tablet"}}
                    </Header>
                  </tr>
                </thead>

                <tbody>
                  {{#each competence.sortedThematics as |thematic|}}
                    {{#each thematic.tubes as |tube index|}}
                      <tr class="row-tube" aria-label={{t "pages.preselect-target-profile.table.row-title"}}>
                        {{#if (eq index 0)}}
                          <Thematic
                            @thematic={{thematic}}
                            @getThematicState={{this.getThematicState}}
                            @selectThematic={{this.selectThematic}}
                            @unselectThematic={{this.unselectThematic}}
                          />
                        {{/if}}
                        <Tube
                          @tube={{tube}}
                          @isTubeSelected={{this.isTubeSelected}}
                          @selectTube={{this.selectTube}}
                          @unselectTube={{this.unselectTube}}
                        />
                      </tr>
                    {{/each}}
                  {{/each}}
                </tbody>
              </table>
            {{/each}}
          </:content>
        </PixAccordions>

      {{/each}}
    </section>
  </template>
}
