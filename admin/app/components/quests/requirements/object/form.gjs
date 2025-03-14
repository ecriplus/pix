import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixRadioButton from '@1024pix/pix-ui/components/pix-radio-button';
import { on } from '@ember/modifier';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import PixFieldset from 'pix-admin/components/ui/pix-fieldset';
import FormField from 'pix-admin/components/quests/requirements/object/form-field';

const LOCAL_STORAGE_KEY = 'QUEST_REQUIREMENT_SNIPPETS';
/**
 * @param {ObjectConfiguration} configuration
 * @param {string} requirementLabel
 * @param {string} requirementComparison
 * @param {{fieldComparison: String, fieldValue: Any, fieldName: String}[]} requirementFields
 */

export default class ObjectRequirementCreateOrEditForm extends Component {
  @tracked objectRequirementLabel;
  @tracked objectRequirementComparison;
  @tracked objectRequirementFields;

  constructor() {
    super(...arguments);
    this.objectRequirementLabel = this.args.requirementLabel ?? '';
    this.objectRequirementComparison = this.args.requirementComparison ?? 'all';
    this.objectRequirementFields = structuredClone(this.args.requirementFields) ?? this.args.configuration.fields.map((fieldConfiguration) => ({
      name: fieldConfiguration.name,
      comparison: null,
      value: null,
    }));
  }

  @action
  onObjectRequirementLabelChanged(event) {
    this.objectRequirementLabel = event.target.value;
  }

  @action
  onObjectRequirementComparisonChanged(value) {
    this.objectRequirementComparison = value;
  }

  @action
  onFieldUpdated({ name, comparison, value }) {
    console.log('onfieldupdated');
    console.log({ name, comparison, value });
    console.log(this.objectRequirementFields);
    const field = this.objectRequirementFields.find((field) => field.name === name);
    field.comparison = comparison;
    field.value = value;
  }

  @action
  onSubmitClicked(event) {
    event.preventDefault();
    const requirement = this.args.configuration.buildRequirementFromFormValues(
      this.objectRequirementComparison,
      this.objectRequirementFields,
    );
    const valueInStorage = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)) ?? { objectRequirementsByLabel: {} };
    valueInStorage.objectRequirementsByLabel[this.objectRequirementLabel] = requirement;
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(valueInStorage));
  }

  <template>
    <form class="admin-form" {{on "submit" this.onSubmitClicked}}>
      <PixInput
        @id="objectRequirementLabel"
        onchange={{this.onObjectRequirementLabelChanged}}
        required={{true}}
        aria-required={{true}}
      >
        <:label>Nom de la condition</:label>
      </PixInput>

      <PixFieldset role="radiogroup">
        <:title>Comment évaluer la condition ?</:title>
        <:content>
          <PixRadioButton
            name="objectRequirementComparison"
            @value={{true}}
            {{on "change" (fn this.onObjectRequirementComparisonChanged "all")}}
            checked={{this.objectRequirementComparison}}
          >
            <:label>Tous les critères sont remplis</:label>
          </PixRadioButton>
          <PixRadioButton
            name="objectRequirementComparison"
            @value={{false}}
            {{on "change" (fn this.onObjectRequirementComparisonChanged "one-of")}}
            checked={{this.objectRequirementComparison}}
          >
            <:label>Au moins un critère est rempli</:label>
          </PixRadioButton>
        </:content>
      </PixFieldset>

      {{#each @configuration.fields as |fieldConfiguration|}}
        <FormField
          @fieldConfiguration={{fieldConfiguration}}
          @onFieldUpdated={{this.onFieldUpdated}}
          @fieldComparison={{this.getFieldComparisonForName fieldConfiguration.name}}
          @fieldValue={{this.getFieldValueForName fieldConfiguration.name}}
        />
      {{/each}}
      <PixButton @type="submit" @size="small" @variant="success">
        Ajouter
      </PixButton>
    </form>
  </template>
}
