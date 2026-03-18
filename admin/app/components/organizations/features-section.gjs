import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { concat, fn, get } from '@ember/helper';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { formatList, t } from 'ember-intl';
import { and, eq, notEq, or } from 'ember-truth-helpers';
import lodashGet from 'lodash/get';
import lodashSet from 'lodash/set';
import Organization from 'pix-admin/models/organization';

import Card from '../card';

export default class OrganizationFeaturesSection extends Component {
  @service accessControl;
  @service store;
  @service intl;
  @service pixToast;

  @tracked isEditMode = false;
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
    return (
      !this.args.organization.isLearnerImportEnabled &&
      (this.args.organization.isOrganizationSCO || this.args.organization.isOrganizationSUP)
    );
  }

  @action
  toggleEditMode() {
    this.isEditMode = !this.isEditMode;
    if (!this.isEditMode) {
      this.#initForm();
    }
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
    this.isEditMode = false;
    return this.args.onSubmit();
  }

  <template>
    <div class="organization__data">
      {{#if this.isEditMode}}
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
              />
            </Card>
          </section>
          <section class="admin-form__actions">
            <PixButton @size="small" @variant="secondary" @triggerAction={{this.toggleEditMode}}>
              {{t "common.actions.cancel"}}
            </PixButton>
            <PixButton @type="submit" @size="small" @variant="success">
              {{t "common.actions.save"}}
            </PixButton>
          </section>
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
              ><:label>
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
      {{else}}
        <section class="admin-form__content">
          <Card
            class="admin-form__card organization-information-section__card"
            @title={{t "components.organizations.creation.features"}}
          >
            <div class="organization-information-section__field">
              <span class="organization-information-section__value">
                <FeaturesList @features={{@organization.features}} />
              </span>
            </div>
          </Card>
        </section>

        {{#if this.accessControl.hasAccessToOrganizationActionsScope}}
          <div class="form-actions organization-information__actions">
            <PixButton @variant="secondary" @size="small" @triggerAction={{this.toggleEditMode}}>
              {{t "common.actions.edit"}}
            </PixButton>
          </div>
        {{/if}}
      {{/if}}
    </div>
  </template>
}

function keys(obj) {
  return Object.keys(obj);
}

class FeaturesList extends Component {
  @service intl;

  attestationLabels = (attestations) => {
    return attestations?.map((name) =>
      this.intl.t(`components.organizations.information-section-view.features.attestation-list.${name}`),
    );
  };

  getOrganizationPlacesLimitText = (isActive) => {
    if (isActive)
      return this.intl.t(
        'components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.enabled',
      );
    return this.intl.t('components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.disabled');
  };

  <template>
    <ul class="organization-information-section__features">
      {{#each (keys Organization.featureList) as |feature|}}
        {{#let
          (get @features feature) (concat "components.organizations.information-section-view.features." feature)
          as |organizationFeature featureLabel|
        }}
          {{#if (eq feature "SHOW_NPS")}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}}>
              <a
                rel="noopener noreferrer"
                href={{organizationFeature.params.formNPSUrl}}
                target="_blank"
              >{{organizationFeature.params.formNPSUrl}}</a>
            </Feature>
          {{else if (eq feature "LEARNER_IMPORT")}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}}>
              {{organizationFeature.params.name}}
            </Feature>
          {{else if (eq feature "ATTESTATIONS_MANAGEMENT")}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}}>
              {{formatList (this.attestationLabels organizationFeature.params)}}
            </Feature>
          {{else if (eq feature "PLACES_MANAGEMENT")}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}}>
              {{this.getOrganizationPlacesLimitText organizationFeature.params.enableMaximumPlacesLimit}}
            </Feature>
          {{else}}
            <Feature @label={{t featureLabel}} @value={{organizationFeature.active}} />
          {{/if}}
        {{/let}}
      {{/each}}
    </ul>
  </template>
}

const Feature = <template>
  <li
    class={{if
      @value
      "organization-information-section__features--enabled"
      "organization-information-section__features--disabled"
    }}
  >
    {{#if @value}}
      <PixIcon @name="checkCircle" aria-label={{concat @label " : " (t "common.words.yes")}} />
    {{else}}
      <PixIcon @name="cancel" aria-label={{concat @label " : " (t "common.words.no")}} />
    {{/if}}
    {{@label}}
    {{#if (and @value (has-block))}}
      :
      {{yield}}
    {{/if}}
  </li>
</template>;

const FeaturesForm = <template>
  {{#each (keys Organization.editableFeatureList) as |feature|}}
    {{#let
      (get @form.features feature) (concat "components.organizations.information-section-view.features." feature)
      as |organizationFeature featureLabel|
    }}
      {{#if (or @isManagingStudentAvailable (notEq feature "IS_MANAGING_STUDENTS"))}}
        {{#if
          (or
            (notEq feature "LEARNER_IMPORT")
            (and (eq feature "LEARNER_IMPORT") (notEq (get @importFormatOptions "length") 0))
          )
        }}
          <div class="form-field">
            <PixCheckbox
              @checked={{organizationFeature.active}}
              {{on "change" (fn @updateFormCheckBoxValue (concat "features." feature ".active"))}}
            ><:label>{{t featureLabel}}</:label></PixCheckbox>
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
                <:label>{{t
                    "components.organizations.editing.organization-learner-import-format.selector.label"
                  }}</:label>
              </PixSelect>
            {{/if}}
          </div>
        {{/if}}
      {{/if}}

      {{#if (and (eq feature "PLACES_MANAGEMENT") (get organizationFeature "active"))}}
        <div class="form-field">
          <PixCheckbox
            @checked={{organizationFeature.params.enableMaximumPlacesLimit}}
            {{on
              "change"
              (fn @updateFormCheckBoxValue (concat "features." feature ".params.enableMaximumPlacesLimit"))
            }}
          ><:label>{{t
                "components.organizations.information-section-view.features.ORGANIZATION_PLACES_LIMIT.label"
              }}</:label></PixCheckbox>
        </div>
      {{/if}}
    {{/let}}
  {{/each}}
</template>;
