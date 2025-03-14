import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { next } from '@ember/runloop';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import ObjectRequirementForm from 'pix-admin/components/quests/requirements/object/form';
import { objectConfigurations } from 'pix-admin/components/quests/requirements/object/object-configuration.js';
import { service } from '@ember/service';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';

export default class RequirementForm extends Component {
  @tracked selectedRequirementType = null;
  @service router;

  constructor() {
    super(...arguments);
    console.log('constructor requirementform');
  }

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
  onRequirementTypeChanged(value) {
    this.selectedRequirementType = null;

    next(this, function() {
      this.selectedRequirementType = value;
    });
  }

  <template>
    <PixSelect
      @onChange={{this.onRequirementTypeChanged}}
      @value={{this.selectedRequirementType}}
      @options={{this.requirementTypeOptions}}
      @screenReaderOnly={{true}}
      @hideDefaultValue={{true}}
    >
      <:label>Sélectionner un type de requirement</:label>
    </PixSelect>
    {{#if this.selectedRequirementType}}
      <ObjectRequirementForm
        @configuration={{this.configurationForSelectedRequirement}}
      />
    {{/if}}
    <PixButtonLink
      @route="authenticated.poc-quest"
      @size="small"
      @variant="primary"
    >
      Revenir au formulaire de quête
    </PixButtonLink>
  </template>
}
