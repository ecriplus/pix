import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonUpload from '@1024pix/pix-ui/components/pix-button-upload';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import { on } from '@ember/modifier';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { not } from 'ember-truth-helpers';
import ENV from 'pix-admin/config/environment';

import AdministrationBlockLayout from '../block-layout';

export default class CreateAttestations extends Component {
  @service intl;
  @service pixToast;
  @service requestManager;

  @tracked file;
  @tracked templateKey;
  @tracked templateName;

  @service store;

  get isFormFilled() {
    return this.file && this.templateKey && this.templateName;
  }

  @action
  async handleFile(files) {
    this.file = files[0];
  }

  @action
  async onTemplateKeyChange(event) {
    this.templateKey = event.target.value;
  }

  @action
  async onTemplateNameChange(event) {
    this.templateName = event.target.value;
  }

  @action
  async onSubmit(event) {
    event.preventDefault();
    try {
      const formData = new FormData();

      formData.append('templateKey', this.templateKey);
      formData.append('templateName', this.templateName);
      formData.append('templateFile', this.file);

      await this.requestManager.request({
        url: `${ENV.APP.API_HOST}/api/admin/attestations`,
        method: 'POST',
        body: formData,
      });

      this.pixToast.sendSuccessNotification({
        message: this.intl.t('components.administration.create-attestations.notifications.success'),
      });
    } catch (error) {
      if (error.status === 413) {
        this.pixToast.sendErrorNotification({
          message: this.intl.t('components.administration.create-attestations.notifications.error.payload-too-large'),
        });
      } else if (error.code === 'S3_UPLOAD_ERROR') {
        this.pixToast.sendErrorNotification({
          message: this.intl.t('components.administration.create-attestations.notifications.error.s3-upload-error'),
        });
      } else if (error.code === 'DUPLICATE_ATTESTATION_KEY') {
        this.pixToast.sendErrorNotification({
          message: this.intl.t(
            'components.administration.create-attestations.notifications.error.duplicate-attestation-key',
          ),
        });
      } else if (error.status === 400 && error.code === 'WRONG_FILE_FORMAT') {
        this.pixToast.sendErrorNotification({
          message: this.intl.t('components.administration.create-attestations.notifications.error.wrong-file-format'),
        });
      } else {
        this.pixToast.sendErrorNotification({
          message: this.intl.t('components.administration.create-attestations.notifications.error.generic-error'),
        });
      }
    }
  }

  <template>
    <form {{on "submit" this.onSubmit}}>
      <AdministrationBlockLayout
        @title={{t "components.administration.create-attestations.title"}}
        @description={{t "components.administration.create-attestations.description"}}
        @actionsClass="create-attestations__actions"
        class="create-attestations"
      >
        <PixInput
          required="true"
          @value={{this.templateKey}}
          {{on "input" this.onTemplateKeyChange}}
          @requiredLabel="Champ obligatoire"
        >
          <:label>{{t "components.administration.create-attestations.template-key"}} </:label>
        </PixInput>
        <PixInput
          required="true"
          @value={{this.templateName}}
          {{on "input" this.onTemplateNameChange}}
          @requiredLabel="Champ obligatoire"
        >
          <:label>{{t "components.administration.create-attestations.template-name"}} </:label>
        </PixInput>
        <PixButtonUpload
          @id="attestations-file-upload"
          @onChange={{this.handleFile}}
          @variant="secondary"
          accept=".pdf"
        >
          {{t "components.administration.create-attestations.upload-button"}}
        </PixButtonUpload>
        <PixButton @type="submit" @size="small" @isDisabled={{not this.isFormFilled}}>
          {{t "components.administration.create-attestations.submit-button"}}
        </PixButton>
      </AdministrationBlockLayout>
    </form>

    {{#if this.errors}}
      <PixNotificationAlert @withIcon={{true}} @type="error" class="create-attestations__errors">
        <ul>
          {{#each this.errors as |error|}}
            <li class="create-attestations__error">
              <span>{{error.detail}}</span>
            </li>
          {{/each}}
        </ul>
      </PixNotificationAlert>
    {{/if}}
  </template>
}
