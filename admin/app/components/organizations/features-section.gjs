import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { concat, fn, get } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { and, eq, not, notEq, or } from 'ember-truth-helpers';
import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';
import Organization from 'pix-admin/models/organization';

import Card from '../card';

export default class OrganizationFeaturesSection extends Component {
  @service accessControl;
  @service store;
  @service pixToast;

  @tracked form = {};
  @tracked importFormats = [];
  @tracked displayLearnerImportActivationDialog = false;
  @tracked learnerImportActivationConfirmed = false;

  constructor() {
    super(...arguments);
    this.#initForm();
    this.#loadAsyncData();
  }

  async #loadAsyncData() {
    this.importFormats = await this.store.findAll('organization-learner-import-format');
  }

  #initForm() {
    this.form = {
      features: structuredClone(this.args.organization.features),
    };
  }

  get importFormatOptions() {
    return this.importFormats.map((importFormat) => ({
      value: importFormat.name,
      label: importFormat.name,
    }));
  }

  get isManagingStudentAvailable() {
    return this.args.organization.isOrganizationSCO || this.args.organization.isOrganizationSUP;
  }

  get isManagingStudentDisabled() {
    return this.args.organization.isLearnerImportEnabled;
  }

  get editableFeatureList() {
    return Organization.editableFeatureList;
  }

  @action
  cancelChanges() {
    this.#initForm();
  }

  @action
  updateFormCheckBoxValue(key) {
    if (key === 'features.LEARNER_IMPORT.active') {
      this.form = lodashSet(
        this.form,
        'features.LEARNER_IMPORT',
        this.form.features?.LEARNER_IMPORT?.active
          ? { active: false }
          : { active: true, params: { name: this.importFormatOptions[0].label } },
      );
      if (this.form.features.LEARNER_IMPORT.active && !this.args.organization.features?.LEARNER_IMPORT?.active) {
        this.displayLearnerImportActivationDialog = true;
        this.learnerImportActivationConfirmed = false;
      }
    } else {
      this.form = lodashSet(this.form, key, !lodashGet(this.form, key));
      if (key === 'features.PLACES_MANAGEMENT.active' && !this.form.features?.PLACES_MANAGEMENT?.active) {
        this.form = lodashSet(this.form, 'features.PLACES_MANAGEMENT.params.enableMaximumPlacesLimit', false);
      }
    }
  }

  @action
  closeLearnerImportActivationDialog() {
    this.displayLearnerImportActivationDialog = false;
    this.updateFormCheckBoxValue('features.LEARNER_IMPORT.active');
  }

  @action
  toggleConfirmLearnerImportActivation() {
    this.learnerImportActivationConfirmed = !this.learnerImportActivationConfirmed;
  }

  @action
  confirmLearnerImportActivation() {
    if (this.learnerImportActivationConfirmed) {
      this.displayLearnerImportActivationDialog = false;
    }
  }

  @action
  updateValue(key, value) {
    this.form = lodashSet(this.form, key, value);
  }

  @action
  async saveFeatures(event) {
    event.preventDefault();
    this.args.organization.set('features', this.form.features);
    return this.args.onSubmit();
  }

  <template>
    <div class="organization__data">
      <form class="admin-form" {{on "submit" this.saveFeatures}}>
        <section class="admin-form__content organization-creation-form">
          <Card
            class="admin-form__card organization-creation-form__card"
            @title={{t "components.organizations.creation.features"}}
          >
            <FeaturesForm
              @form={{this.form}}
              @importFormatOptions={{this.importFormatOptions}}
              @updateFormCheckBoxValue={{this.updateFormCheckBoxValue}}
              @updateValue={{this.updateValue}}
              @isManagingStudentAvailable={{this.isManagingStudentAvailable}}
              @isManagingStudentDisabled={{this.isManagingStudentDisabled}}
              @editableFeatureList={{this.editableFeatureList}}
              @canEdit={{this.accessControl.hasAccessToOrganizationActionsScope}}
            />
          </Card>
        </section>
        {{#if this.accessControl.hasAccessToOrganizationActionsScope}}
          <section class="admin-form__actions">
            <PixButton @size="small" @variant="secondary" @triggerAction={{this.cancelChanges}}>
              {{t "common.actions.cancel"}}
            </PixButton>
            <PixButton @type="submit" @size="small" @variant="success">
              {{t "common.actions.save"}}
            </PixButton>
          </section>
        {{/if}}
      </form>

      <PixModal
        @title={{t "components.organizations.editing.organization-learner-import-format.dialog.title"}}
        @onCloseButtonClick={{this.closeLearnerImportActivationDialog}}
        @showModal={{this.displayLearnerImportActivationDialog}}
      >
        <:content>
          <p>
            {{t "components.organizations.editing.organization-learner-import-format.dialog.message"}}
          </p>
          <p>
            <PixCheckbox
              @checked={{this.learnerImportActivationConfirmed}}
              {{on "change" this.toggleConfirmLearnerImportActivation}}
            >
              <:label>
                <strong>
                  {{t "components.organizations.editing.organization-learner-import-format.dialog.confirmation"}}
                </strong>
              </:label>
            </PixCheckbox>
          </p>
        </:content>
        <:footer>
          <PixButton @variant="secondary" @triggerAction={{this.closeLearnerImportActivationDialog}}>
            {{t "common.actions.cancel"}}
          </PixButton>
          <PixButton @variant="error" @triggerAction={{this.confirmLearnerImportActivation}}>
            {{t "common.actions.confirm"}}
          </PixButton>
        </:footer>
      </PixModal>
    </div>
  </template>
}

function keys(obj) {
  return Object.keys(obj);
}

const FeaturesForm = <template>
  {{#each (keys Organization.featureList) as |feature|}}
    {{#let
      (get @form.features feature)
      (concat "components.organizations.information-section-view.features." feature)
      (get @editableFeatureList feature)
      as |organizationFeature featureLabel isEditable|
    }}
      {{#if isEditable}}
        {{#if
          (or
            (notEq feature "LEARNER_IMPORT")
            (and (eq feature "LEARNER_IMPORT") (notEq (get @importFormatOptions "length") 0))
          )
        }}
          <div class="features-section__feature-item">
            <div class="form-field">
              <PixCheckbox
                @checked={{organizationFeature.active}}
                disabled={{or
                  (not @canEdit)
                  (and
                    (eq feature "IS_MANAGING_STUDENTS")
                    (or @isManagingStudentDisabled (not @isManagingStudentAvailable))
                  )
                }}
                {{on "change" (fn @updateFormCheckBoxValue (concat "features." feature ".active"))}}
              >
                <:label>
                  {{t featureLabel}}
                </:label>
              </PixCheckbox>
              {{#if (and (eq feature "LEARNER_IMPORT") (get organizationFeature "active"))}}
                <PixSelect
                  required
                  @aria-required={{true}}
                  @requiredLabel={{t "common.forms.mandatory"}}
                  @options={{@importFormatOptions}}
                  @value={{organizationFeature.params.name}}
                  @onChange={{fn @updateValue "features.LEARNER_IMPORT.params.name"}}
                  @hideDefaultOption={{true}}
                  @isFullWidth={{false}}
                  @placeholder={{t
                    "components.organizations.editing.organization-learner-import-format.selector.placeholder"
                  }}
                >
                  <:label>
                    {{t "components.organizations.editing.organization-learner-import-format.selector.label"}}
                  </:label>
                </PixSelect>
              {{/if}}
            </div>
            {{#if (eq feature "PLACES_MANAGEMENT")}}
              <div class="form-field">
                <PixCheckbox
                  @checked={{organizationFeature.params.enableMaximumPlacesLimit}}
                  disabled={{not (and @canEdit (get organizationFeature "active"))}}
                  {{on
                    "change"
                    (fn @updateFormCheckBoxValue (concat "features." feature ".params.enableMaximumPlacesLimit"))
                  }}
                >
                  <:label>
                    {{t "components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.label"}}
                  </:label>
                </PixCheckbox>
              </div>
            {{/if}}
          </div>
        {{/if}}
      {{else}}
        <div class="features-section__feature-item">
          <div class="form-field">
            <PixCheckbox @checked={{organizationFeature.active}} disabled>
              <:label>
                {{t featureLabel}}
              </:label>
            </PixCheckbox>
          </div>
        </div>
      {{/if}}
    {{/let}}
  {{/each}}
</template>;
