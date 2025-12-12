import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import PixTextarea from '@1024pix/pix-ui/components/pix-textarea';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { not } from 'ember-truth-helpers';

import SafeMarkdownToHtml from '../safe-markdown-to-html';
import Breadcrumb from '../target-profiles/breadcrumb';
import CampaignCriterion from './campaign-criterion';
import CappedTubesCriterion from './capped-tubes-criterion';
import { DescriptionList } from 'pix-admin/components/ui/description-list';

export default class Badge extends Component {
  @service pixToast;
  @service store;
  @service intl;

  @tracked editMode = false;
  @tracked form = {};
  @tracked criteria = [];

  constructor() {
    super(...arguments);
    Promise.resolve(this.args.badge.criteria).then((criteria) => {
      this.criteria = criteria;
    });
  }

  get isCertifiableText() {
    return this.args.badge.isCertifiable ? 'Certifiable' : 'Non certifiable';
  }

  get isAlwaysVisibleText() {
    return this.args.badge.isAlwaysVisible ? 'Lacunes' : null;
  }

  get imageUrl() {
    return this.args.badge.imageUrl;
  }

  get campaignScopeCriterion() {
    return this.criteria.find((criterion) => criterion.isCampaignScope) || null;
  }

  get cappedTubesCriteria() {
    return this.criteria.filter((criterion) => criterion.isCappedTubesScope);
  }

  @action
  async updateBadge(event) {
    event.preventDefault();

    try {
      const badgeDTO = {
        title: this.form.title,
        key: this.form.key,
        message: this.form.message,
        altMessage: this.form.altMessage,
        isCertifiable: this.form.isCertifiable,
        isAlwaysVisible: this.form.isAlwaysVisible,
        imageUrl: this.form.imageUrl,
      };
      await this.args.onUpdateBadge(badgeDTO);
      this.pixToast.sendSuccessNotification({ message: 'Le badge a été mis à jour.' });
      this.editMode = false;
    } catch (error) {
      let errorMessage;
      error.errors.forEach((error) => {
        if (error?.code === 'BADGE_KEY_UNIQUE_CONSTRAINT_VIOLATED') {
          errorMessage = this.intl.t('components.badges.api-error-messages.key-already-exists', {
            badgeKey: error.meta,
          });
        } else if (error?.detail.includes('data.attributes.image-url')) {
          errorMessage = this.intl.t('components.badges.api-error-messages.incorrect-image-url-format');
        } else {
          errorMessage = error.detail;
        }
        this.pixToast.sendErrorNotification({ message: errorMessage });
      });
    }
  }

  @action
  cancel() {
    this.toggleEditMode();
  }

  @action
  onFormInputChange(name) {
    return (event) => {
      this.form[name] = event.target.value;
    };
  }

  @action
  onFormCheckToggle(name) {
    return () => {
      this.form[name] = !this.form[name];
    };
  }

  @action
  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this._initForm();
    }
  }

  _initForm() {
    this.form = {
      title: this.args.badge.title,
      key: this.args.badge.key,
      message: this.args.badge.message,
      altMessage: this.args.badge.altMessage,
      isCertifiable: this.args.badge.isCertifiable,
      isAlwaysVisible: this.args.badge.isAlwaysVisible,
      imageUrl: this.args.badge.imageUrl,
    };
  }

  <template>
    <header class="page-header">
      <Breadcrumb @targetProfile={{@targetProfile}} @currentPageLabel={{@badge.id}} />
    </header>

    <main class="page-body">
      <section class="page-section">

        {{#if this.editMode}}
          <form class="form" {{on "submit" this.updateBadge}}>
            <div class="badge-edit-form__field">
              <PixInput
                class="form-control"
                @value={{this.form.title}}
                @requiredLabel={{true}}
                {{on "input" (this.onFormInputChange "title")}}
              ><:label>Titre</:label></PixInput>
            </div>
            <div class="badge-edit-form__field">
              <PixInput
                class="form-control"
                @value={{this.form.key}}
                @requiredLabel={{true}}
                {{on "input" (this.onFormInputChange "key")}}
              ><:label>Clé</:label></PixInput>
            </div>
            <div class="badge-edit-form__field">
              <PixTextarea
                class="form-control"
                @value={{this.form.message}}
                rows="4"
                {{on "input" (this.onFormInputChange "message")}}
              ><:label>Message</:label></PixTextarea>
            </div>
            <div class="badge-edit-form__field">
              <PixInput
                class="form-control"
                @value={{this.form.imageUrl}}
                @requiredLabel={{t "common.forms.mandatory"}}
                {{on "input" (this.onFormInputChange "imageUrl")}}
              ><:label>Url de l'image (svg)</:label></PixInput>
            </div>
            <div class="badge-edit-form__field">
              <PixInput
                class="form-control"
                @value={{this.form.altMessage}}
                @requiredLabel={{t "common.forms.mandatory"}}
                {{on "input" (this.onFormInputChange "altMessage")}}
              ><:label>Message Alternatif</:label></PixInput>
            </div>
            <div class="badge-edit-form__checkboxes">
              <div>
                <PixCheckbox
                  @checked={{this.form.isCertifiable}}
                  @variant="tile"
                  {{on "change" (this.onFormCheckToggle "isCertifiable")}}
                ><:label>Certifiable</:label></PixCheckbox>
              </div>
              <div>
                <PixCheckbox
                  @type="checkbox"
                  @checked={{this.form.isAlwaysVisible}}
                  @variant="tile"
                  {{on "change" (this.onFormCheckToggle "isAlwaysVisible")}}
                ><:label>Lacunes</:label></PixCheckbox>
              </div>
            </div>
            <div class="badge-edit-form__actions">
              <PixButton @size="small" @variant="secondary" @triggerAction={{this.cancel}}>
                {{t "common.actions.cancel"}}
              </PixButton>
              <PixButton @type="submit" @size="small" @variant="success" data-testid="save-badge-edit">
                {{t "common.actions.save"}}
              </PixButton>
            </div>
          </form>
        {{else}}
          <div class="badge-details">
            <div>
              <DescriptionList>

                <DescriptionList.Divider />

                <DescriptionList.Item @label="ID">
                  {{@badge.id}}
                </DescriptionList.Item>

                <DescriptionList.Divider />

                <DescriptionList.Item @label="Clé">
                  {{@badge.key}}
                </DescriptionList.Item>

                <DescriptionList.Divider />

                <DescriptionList.Item @label="Nom du badge">
                  {{@badge.title}}
                </DescriptionList.Item>

                <DescriptionList.Divider />

                <DescriptionList.Item @label="Url de l'image">
                  {{@badge.imageUrl}}
                </DescriptionList.Item>

                <DescriptionList.Divider />

                <DescriptionList.Item @label="Message">
                  <blockquote>
                    <SafeMarkdownToHtml @markdown={{@badge.message}} />
                  </blockquote>
                </DescriptionList.Item>

                <DescriptionList.Divider />

                <DescriptionList.Item @label="Message alternatif">
                  {{@badge.altMessage}}
                </DescriptionList.Item>

                <DescriptionList.Divider />

              </DescriptionList>

              <PixButton
                @variant="secondary"
                @size="small"
                @triggerAction={{this.toggleEditMode}}
              >
                Modifier les informations
              </PixButton>
            </div>

            <div class="badge-details__image">
              <img src={{@badge.imageUrl}} alt="" width="90px" />
              {{#if @badge.isCertifiable}}
                <PixTag @color="success" class="badge-details__tag">
                  {{this.isCertifiableText}}
                </PixTag>
              {{/if}}
              {{#if @badge.isAlwaysVisible}}
                <PixTag @color="tertiary" class="badge-details__tag">
                  {{this.isAlwaysVisibleText}}
                </PixTag>
              {{/if}}
            </div>
          </div>
        {{/if}}
      </section>

      <section class="badge__criteria main-admin-form">
        <div class="admin-form__content">
          {{#if this.campaignScopeCriterion}}
            <CampaignCriterion
              @criterion={{this.campaignScopeCriterion}}
              @isEditable={{not @targetProfile.hasLinkedCampaign}}
            />
          {{/if}}
          {{#if this.cappedTubesCriteria.length}}
            <h2 class="badge-criterion__title">
              Liste des critères d'obtention basés sur une sélection de sujets du profil cible&nbsp;:
            </h2>
            {{#each this.cappedTubesCriteria as |criterion|}}
              <div class="card">
                <CappedTubesCriterion
                  @criterion={{criterion}}
                  @targetProfile={{@targetProfile}}
                  @displaySkillDifficultySelection={{false}}
                />
              </div>
            {{/each}}
          {{/if}}
        </div>
      </section>
    </main>
  </template>
}
