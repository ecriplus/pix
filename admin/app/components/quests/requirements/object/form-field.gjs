import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

/**
 * @param {FieldConfiguration} fieldConfiguration
 * @param {function} onFieldUpdated {name, comparison, value}
 * @param {string} fieldComparison
 * @param {string|boolean|number} fieldValue
 */
export default class ObjectRequirementCreateOrEditFormField extends Component {
  @tracked shouldEnableField;
  @tracked selectedComparison;
  @tracked rawValue;

  constructor() {
    super(...arguments);
    this.shouldEnableField = this.args.fieldComparison && (this.args.fieldValue || this.args.fieldValue === false);
    this.selectedComparison = this.args.fieldComparison ?? null;
    this.rawValue = (this.args.fieldValue || this.args.fieldValue === false) ? this.args.fieldValue : null;
  }

  @action
  onToggleFieldVisibility(event) {
    this.rawValue = null;
    this.selectedComparison = null;
    this.shouldEnableField = event.target.checked;
    this.updateField();
  }

  @action
  onComparisonChanged(value) {
    this.rawValue = null;
    this.selectedComparison = value;
    this.updateField();
  }

  @action
  onBooleanFieldValueChanged(value) {
    this.rawValue = value;
    this.updateField();
  }

  @action
  onFieldValueChanged(event) {
    this.rawValue = event.target.value;
    this.updateField();
  }

  updateField() {
    this.args.onFieldUpdated({
      name: this.args.fieldConfiguration.name,
      comparison: this.selectedComparison,
      value: this.rawValue,
    });
  }

  get checkboxLabel() {
    return this.args.fieldConfiguration.name + (this.shouldEnableField ? '' : ' ?');
  }

  get typeHelpLabel() {
    const isArray = this.args.fieldConfiguration.refersToAnArray;
    if(this.args.fieldConfiguration.type === 'BOOLEAN') {
      return isArray ? 'Tableau de booléens' : 'Booléen';
    }
    if(this.args.fieldConfiguration.type === 'NUMBER') {
      return isArray ? 'Tableau de nombres' : 'Nombre';
    }
    if(this.args.fieldConfiguration.type === 'STRING') {
      return isArray ? 'Tableau de chaînes' : 'Chaîne';
    }
  }

  get comparisonOptions() {
    const allowedValuesStr = this.args.fieldConfiguration.allowedValues.length > 0
      ? ' - valeur autorisées : ' + this.args.fieldConfiguration.allowedValues.join(',')
      : '';
    if(this.args.fieldConfiguration.refersToAnArray) {
      return [
        { value: 'all', label: 'possède toutes les valeurs dans' + allowedValuesStr },
        { value: 'one-of', label: 'possède au moins une des valeurs dans' + allowedValuesStr },
      ];
    } else {
      return [
        { value: 'equal', label: 'a exactement la valeur' + allowedValuesStr },
        { value: 'one-of', label: 'a la valeur parmi' + allowedValuesStr },
      ];
    }
  }

  get booleanOptions() {
    return [
      { value: true, label: 'Vrai' },
      { value: false, label: 'Faux' },
    ];
  }

  get inputLabel() {
    if(['one-of', 'all'].includes(this.selectedComparison)) {
      return 'Saisir les valeurs séparées par des virgules, sans espaces';
    } else {
      return 'Saisir la valeur';
    }
  }

  get shouldDisplayBooleanSelect() {
    return this.args.fieldConfiguration.type === 'BOOLEAN' && this.selectedComparison === 'equal';
  }

  <template>
    <PixCheckbox
      {{on "change" this.onToggleFieldVisibility}}
      @id="toggleFieldVisibility_iamnotuniqueidsorry"
      @value={{this.shouldEnableField}}
      checked={{this.shouldEnableField}}
    >
      <:label><b>{{this.checkboxLabel}}</b> ({{this.typeHelpLabel}})</:label>
    </PixCheckbox>
    {{#if this.shouldEnableField}}
      <PixSelect
        @onChange={{this.onComparisonChanged}}
        @value={{this.selectedComparison}}
        @options={{this.comparisonOptions}}
        @screenReaderOnly={{true}}
        @hideDefaultValue={{true}}
      >
        <:label>Sélectionner une modalité de comparaison</:label>
      </PixSelect>
      {{#if this.selectedComparison}}
        {{#if this.shouldDisplayBooleanSelect}}
          <PixSelect
            @onChange={{this.onBooleanFieldValueChanged}}
            @value={{this.rawValue}}
            @options={{this.booleanOptions}}
            @screenReaderOnly={{true}}
            @hideDefaultValue={{true}}
          >
            <:label>Sélectionner une modalité de comparaison</:label>
          </PixSelect>
        {{else}}
          <PixInput
            @id="fieldValue_iamnotuniqueidsorry"
            onchange={{this.onFieldValueChanged}}
            required={{true}}
            aria-required={{true}}
          >
            <:label>{{this.inputLabel}}</:label>
          </PixInput>
        {{/if}}
      {{/if}}
    {{/if}}
  </template>
}
