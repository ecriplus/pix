import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import dayjs from 'dayjs';
import { t } from 'ember-intl';
import get from 'lodash/get';

const categories = [
  { value: 'FULL_RATE', label: 'Tarif plein' },
  { value: 'SPECIAL_REDUCE_RATE', label: 'Tarif réduit spécial' },
  { value: 'REDUCE_RATE', label: 'Tarif réduit' },
  { value: 'PUBLIC_RATE', label: 'Tarif public' },
  { value: 'FREE_RATE', label: 'Tarif gratuit' },
];

export default class PlacesLotCreationForm extends Component {
  @tracked selectedCategory = null;

  @tracked count;
  @tracked activationDate;
  @tracked expirationDate;
  @tracked category;
  @tracked reference;
  @tracked isLoading = false;

  constructor() {
    super(...arguments);
    this.categories = categories;
    this.activationDate = dayjs(new Date()).format('YYYY-MM-DD');
  }

  @action
  async onSubmit(event) {
    event.preventDefault();

    if (this.isLoading) return;

    this.isLoading = true;

    await this.args.create({
      count: this.count,
      activationDate: this.activationDate,
      expirationDate: this.expirationDate ? this.expirationDate : null,
      category: this.category,
      reference: this.reference,
    });
    this.isLoading = false;
  }

  @action
  selectCategory(value) {
    const newValue = value || null;
    this.category = newValue;
  }

  @action
  onCountChange(event) {
    this.count = event.target.value;
  }

  @action
  onActivationDateChange(event) {
    this.activationDate = event.target.value;
  }

  @action
  onExpirationDateChange(event) {
    this.expirationDate = event.target.value;
  }

  @action
  onReferenceChange(event) {
    this.reference = event.target.value;
  }

  getCategoryByValue(value) {
    if (value) {
      return find(this.categories, { value });
    }
    return this.categories[0];
  }

  <template>
    <section class="page-section">
      <div class="places__add-form">
        <form class="form" {{on "submit" this.onSubmit}}>
          <span class="form__instructions">
            {{t "common.forms.mandatory-fields" htmlSafe=true}}
          </span>
          <div class="form-field">
            <PixInput
              class={{if @errors.count "form-control is-invalid" "form-control"}}
              @value={{this.count}}
              {{on "input" this.onCountChange}}
            ><:label>Nombre :</:label></PixInput>

            {{#if @errors.count}}
              <div class="form-field__error">
                {{get @errors.count "0.message"}}
              </div>
            {{/if}}
          </div>
          <div class="form-field">
            <PixInput
              type="date"
              class={{if @errors.activationDate "form-control is-invalid" "form-control"}}
              @value={{this.activationDate}}
              @requiredLabel={{true}}
              {{on "input" this.onActivationDateChange}}
            ><:label>Date d'activation</:label></PixInput>

            {{#if @errors.activationDate}}
              <div class="form-field__error">
                {{get @errors.activationDate "0.message"}}
              </div>
            {{/if}}
          </div>
          <div class="form-field">
            <PixInput
              class={{if @errors.expirationDate "form-control is-invalid" "form-control"}}
              type="date"
              @value={{this.expirationDate}}
              {{on "input" this.onExpirationDateChange}}
            ><:label>Date d'expiration</:label></PixInput>

            {{#if @errors.expirationDate}}
              <div class="form-field__error">
                {{get @errors.expirationDate "0.message"}}
              </div>
            {{/if}}
          </div>
          <div class="form-field">
            <PixSelect
              @options={{this.categories}}
              @placeholder="Sélectionnez une catégorie"
              @onChange={{this.selectCategory}}
              @value={{this.category}}
              @errorMessage={{get @errors.category "0.message"}}
              @requiredLabel="Champs obligatoire"
            >
              <:label>Catégorie</:label>
            </PixSelect>
          </div>
          <div class="form-field">
            <PixInput
              @value={{this.reference}}
              class={{if @errors.reference "form-control is-invalid" "form-control"}}
              maxlength="255"
              @requiredLabel={{true}}
              {{on "input" this.onReferenceChange}}
            ><:label>Référence</:label></PixInput>

            {{#if @errors.reference}}
              <div class="form-field__error">
                {{get @errors.reference "0.message"}}
              </div>
            {{/if}}
          </div>

          <div class="form-actions">
            <PixButtonLink
              class="action-buttons__cancel"
              @variant="secondary"
              @size="small"
              @route="authenticated.organizations.get.places"
            >
              {{t "common.actions.cancel"}}
            </PixButtonLink>
            <PixButton @type="submit" @size="small" @variant="success" @isLoading={{this.isLoading}}>
              {{t "common.actions.add"}}
            </PixButton>
          </div>
        </form>
      </div>
    </section>
  </template>
}
