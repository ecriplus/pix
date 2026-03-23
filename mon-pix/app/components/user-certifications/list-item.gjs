import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixNotificationAlert from '@1024pix/pix-ui/components/pix-notification-alert';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import { t } from 'ember-intl';
import CopyPasteButton from 'mon-pix/components/copy-paste-button';
import { CERTIFICATE_STATUSES, EXTRA_CERTIFICATE_STATUSES } from 'mon-pix/models/certificate-summary';

export default class ListItem extends Component {
  @service intl;
  @service session;
  @service fileSaver;
  @service currentDomain;
  @service locale;

  @tracked errorMessage = null;

  get statusTagData() {
    const tagMap = {
      [CERTIFICATE_STATUSES.VALIDATED]: {
        color: 'green',
        content: this.intl.t('pages.certifications-list.statuses.validated'),
        displayFramework: true,
      },
      [CERTIFICATE_STATUSES.REJECTED]: {
        color: 'error',
        content: this.intl.t('pages.certifications-list.statuses.rejected'),
        displayFramework: true,
      },
      [CERTIFICATE_STATUSES.CANCELLED]: {
        color: 'error',
        content: this.intl.t('pages.certifications-list.statuses.cancelled'),
        displayFramework: false,
      },
      [CERTIFICATE_STATUSES.WAITING_FOR_RESULTS]: {
        color: 'primary',
        content: this.intl.t('pages.certifications-list.statuses.not-published'),
        displayFramework: false,
      },
    };
    return tagMap[this.args.certificateSummary.status];
  }

  get extraStatusTagData() {
    if (!this.args.certificateSummary.extraCertificationStatus) return null;

    const tagMap = {
      [EXTRA_CERTIFICATE_STATUSES.NOT_APPLICABLE]: null,
      [EXTRA_CERTIFICATE_STATUSES.ACQUIRED]: {
        color: 'green',
        content: this.intl.t('pages.certifications-list.statuses.validated'),
      },
      [EXTRA_CERTIFICATE_STATUSES.NOT_ACQUIRED]: {
        color: 'error',
        content: this.intl.t('pages.certifications-list.statuses.rejected'),
      },
    };
    return tagMap[this.args.certificateSummary.extraCertificationStatus];
  }

  get isPublished() {
    return this.args.certificateSummary.status !== CERTIFICATE_STATUSES.WAITING_FOR_RESULTS;
  }

  get shouldDisplayFramework() {
    return !this.isPublished || this.args.certificateSummary.status === CERTIFICATE_STATUSES.CANCELLED;
  }

  get frameworkName() {
    return this.intl.t(`pages.certification-frameworks.${this.args.certificateSummary.certificationFramework}`);
  }

  get notObtainedCertificationWithComment() {
    return (
      (this.args.certificateSummary.isRejected || this.args.certificateSummary.isCancelled) &&
      this.args.certificateSummary.comment
    );
  }

  get pixScore() {
    return this.args.certificateSummary.isValidated ? this.args.certificateSummary.pixScore : '-';
  }

  get downloadLabel() {
    if (this.args.certificateSummary.isDocumentAttestation) {
      return this.intl.t('pages.certifications-list.buttons.download-attestation');
    }
    return this.intl.t('pages.certifications-list.buttons.download-certificate');
  }

  @action
  async downloadAttestation() {
    this.errorMessage = null;
    const certificationId = this.args.certificateSummary.id;
    const lang = this.locale.currentLanguage;

    const url = `/api/attestation/${certificationId}?isFrenchDomainExtension=${this.currentDomain.isFranceDomain}&lang=${lang}`;

    const token = this.session.data.authenticated.access_token;
    try {
      await this.fileSaver.save({ url, token });
    } catch {
      this.errorMessage = this.intl.t('common.error');
    }
  }

  <template>
    <PixBlock class="certification-item">
      <div class="certification-item__details">
        <div>
          <PixTag @color={{this.statusTagData.color}} class="tag">
            <div>
              {{#if this.extraStatusTagData}}
                <strong>{{t "pages.certification-frameworks.CORE"}}&nbsp;:</strong>
              {{else if this.statusTagData.displayFramework}}
                <strong>{{this.frameworkName}}&nbsp;:</strong>
              {{/if}}
              {{this.statusTagData.content}}
            </div>
          </PixTag>
          {{#if this.extraStatusTagData}}
            <PixTag

              @color={{this.extraStatusTagData.color}}
              class="tag"
            >
              <div>
                <strong>{{this.frameworkName}}&nbsp;:</strong>
                {{this.extraStatusTagData.content}}
              </div>
            </PixTag>
          {{/if}}
          {{#if this.shouldDisplayFramework}}
            <p data-testid="pw-certification-card-details-framework" class="info">
              <strong>{{this.frameworkName}}</strong>
            </p>
          {{/if}}
          <p class="info">
            {{t "pages.certifications-list.information.certification-center"}}
            {{@certificateSummary.certificationCenterName}}
          </p>
          <p class="info">
            {{t "pages.certifications-list.information.date"}}
            {{dayjsFormat @certificateSummary.certificationStartedAt "DD/MM/YYYY"}}
          </p>
        </div>
        <div class="certification-item__hexagon">
          <strong class="score">{{this.pixScore}}</strong>
          {{#if @certificateSummary.isValidated}}
            <span class="pix">{{t "common.pix"}}</span>
          {{/if}}
        </div>
      </div>
      {{#if this.notObtainedCertificationWithComment}}
        <p class="certification-item-comment">
          {{t "pages.certifications-list.comment"}}
          {{@certificateSummary.comment}}
        </p>
      {{/if}}

      {{#if @certificateSummary.isValidated}}
        {{#if this.errorMessage}}
          <PixNotificationAlert @type="error" @withIcon={{true}} class="certification-item-error">
            <p>{{this.errorMessage}}</p>
          </PixNotificationAlert>
        {{/if}}

        <div class="certification-item-verification-code">
          <span>{{t "pages.certificate.verification-code.title"}}&nbsp;: {{@certificateSummary.verificationCode}}</span>
          <div class="copy-paste">
            <CopyPasteButton
              class="pix-icon-button--xsmall"
              @clipBoardtext={{@certificateSummary.verificationCode}}
              @successMessage={{t "pages.certificate.verification-code.copied"}}
              @defaultMessage={{t "pages.certificate.verification-code.copy"}}
            />
          </div>
        </div>

        <ul class="certification-item-buttons">
          <li>
            <PixButtonLink
              @variant="secondary"
              @route="authenticated.user-certifications.get"
              @model={{@certificateSummary.id}}
              @iconBefore="eye"
            >
              {{t "pages.certifications-list.buttons.details"}}
            </PixButtonLink>
          </li>
          <li>
            <PixButton
              @triggerAction={{this.downloadAttestation}}
              @loadingColor="grey"
              @iconBefore="download"
              @variant="tertiary"
            >
              {{this.downloadLabel}}
            </PixButton>
          </li>
        </ul>
      {{/if}}
    </PixBlock>
  </template>
}
