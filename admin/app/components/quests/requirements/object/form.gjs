import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixRadioButton from '@1024pix/pix-ui/components/pix-radio-button';
import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { eq } from 'ember-truth-helpers';
import FormField from 'pix-admin/components/quests/requirements/object/form-field';
import PixFieldset from 'pix-admin/components/ui/pix-fieldset';

const LOCAL_STORAGE_KEY = 'QUEST_REQUIREMENT_SNIPPETS';

/**
 * @param {ObjectConfiguration} configuration
 * @param {string} requirementLabel
 * @param {string} requirementComparison
 * @param {{fieldComparison: String, fieldValue: Any, fieldName: String}[]} requirementFields
 */
export default class ObjectRequirementCreateOrEditForm extends Component {
  @service pixToast;
  @tracked formLabel;
  @tracked formComparison;
  @tracked formFields;

  constructor() {
    super(...arguments);
    this.formLabel = this.args.requirementLabel ?? '';
    this.formComparison = this.args.requirementComparison ?? 'all';
    this.formFields =
      structuredClone(this.args.requirementFields) ??
      this.args.configuration.fieldConfigurations.map((fieldConfiguration) => ({
        name: fieldConfiguration.name,
        comparison: null,
        value: null,
      }));
  }

  @action
  updateLabel(event) {
    this.formLabel = event.target.value;
  }

  @action
  updateComparison(value) {
    this.formComparison = value;
  }

  @action
  updateField({ name, comparison, value }) {
    const field = this.formFields.find((field) => field.name === name);
    field.comparison = comparison;
    field.value = value;
  }

  @action
  saveSnippet(event) {
    event.preventDefault();
    try {
      const requirement = this.args.configuration.buildRequirementFromFormValues(this.formComparison, this.formFields);
      const snippets = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY)) ?? {
        objectRequirementsByLabel: {},
      };
      snippets.objectRequirementsByLabel[this.formLabel] = requirement;
      window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(snippets));
      this.pixToast.sendSuccessNotification({ message: 'Le requirement est ajouté dans le local storage.' });
    } catch (error) {
      console.log(error);
      this.pixToast.sendErrorNotification({ message: "Le requirement n'a pas pu être ajouté." });
    }
  }

  <template>
    <form class="quest-object-form" {{on "submit" this.saveSnippet}}>
      <PixInput onchange={{this.updateLabel}} required={{true}} aria-required={{true}}>
        <:label>Nom de la condition</:label>
      </PixInput>

      <PixFieldset role="radiogroup">
        <:title>Comment évaluer la condition ?</:title>
        <:content>
          <PixRadioButton
            name="comparison"
            @value={{true}}
            {{on "change" (fn this.updateComparison "all")}}
            checked={{eq this.formComparison "all"}}
          >
            <:label>Tous les critères sont remplis</:label>
          </PixRadioButton>
          <PixRadioButton
            name="comparison"
            @value={{false}}
            {{on "change" (fn this.updateComparison "one-of")}}
            checked={{eq this.formComparison "one-of"}}
          >
            <:label>Au moins un critère est rempli</:label>
          </PixRadioButton>
        </:content>
      </PixFieldset>

      {{#each @configuration.fieldConfigurations as |fieldConfiguration|}}
        <FormField
          @fieldConfiguration={{fieldConfiguration}}
          @onFieldUpdated={{this.updateField}}
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
