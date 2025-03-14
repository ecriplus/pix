import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { runTask } from 'ember-lifeline';
import ObjectRequirementForm from 'pix-admin/components/quests/requirements/object/form';
import { objectConfigurations } from 'pix-admin/components/quests/requirements/object/object-configuration.js';

export default class RequirementForm extends Component {
  @tracked selectedRequirementType = null;
  @service router;

  get requirementTypeOptions() {
    return [
      { value: 'organization', label: 'Organization' },
      { value: 'organizationLearner', label: 'Organization Learner' },
      { value: 'campaignParticipations', label: 'Participation' },
    ];
  }

  get configurationForSelectedRequirement() {
    return objectConfigurations[this.selectedRequirementType];
  }

  @action
  updateRequirementType(value) {
    this.selectedRequirementType = null;

    runTask(this, function () {
      this.selectedRequirementType = value;
    });
  }

  <template>
    <PixBlock @variant="admin" class="quest-requirement-form">
      <h1>Créer ou Éditer un "requirement" de quête</h1>
      <PixSelect
        @onChange={{this.updateRequirementType}}
        @value={{this.selectedRequirementType}}
        @options={{this.requirementTypeOptions}}
        @placeholder="Choisissez votre type de requirement"
        @hideDefaultOption={{true}}
      >
        <:label>Sélectionner un type de requirement</:label>
      </PixSelect>

      <div>
        {{#if this.selectedRequirementType}}
          <ObjectRequirementForm @configuration={{this.configurationForSelectedRequirement}} />
        {{/if}}
      </div>

      <PixButtonLink @route="authenticated.quest-creator" @size="small" @variant="primary">
        Revenir au formulaire de quête
      </PixButtonLink>
    </PixBlock>
  </template>
}
