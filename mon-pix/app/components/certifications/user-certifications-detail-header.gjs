import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixButtonLink from '@1024pix/pix-ui/components/pix-button-link';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import CopyButton from 'ember-cli-clipboard/components/copy-button';
import isClipboardSupported from 'ember-cli-clipboard/helpers/is-clipboard-supported';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import t from 'ember-intl/helpers/t';
import UserCertificationsHexagonScore from 'mon-pix/components/certifications/user-certifications-hexagon-score';

import parseISODateOnly from '../../utils/parse-iso-date-only';

export default class UserCertificationsDetailHeader extends Component {
  <template>
    {{! template-lint-disable no-redundant-fn }}
    {{#if @certification.date}}
      <div class="user-certifications-detail-header">
        <UserCertificationsHexagonScore @score={{@certification.pixScore}} />
        <div class="user-certifications-detail-header__info-certificate">
          <h1>{{t "pages.certificate.title"}}</h1>

          <p class="user-certifications-detail-header__info-certificate--grey">
            {{t "pages.certificate.issued-on"}}
            {{dayjsFormat @certification.deliveredAt "D MMMM YYYY"}}
          </p>

          <p>{{@certification.fullName}}</p>
          <p>
            {{#if @certification.birthplace}}
              {{t
                "pages.certificate.candidate-birth-complete"
                birthdate=(dayjsFormat this.birthdateMidnightLocalTime "D MMMM YYYY")
                birthplace=@certification.birthplace
              }}
            {{else}}
              {{t
                "pages.certificate.candidate-birth"
                birthdate=(dayjsFormat this.birthdateMidnightLocalTime "D MMMM YYYY")
              }}
            {{/if}}
          </p>

          {{#if @certification.certificationCenter}}
            <p>{{t "pages.certificate.certification-center"}} {{@certification.certificationCenter}}</p>
          {{/if}}

          <p>{{t "pages.certificate.exam-date"}} {{dayjsFormat @certification.date "D MMMM YYYY"}}</p>

          {{#if @certification.shouldDisplayProfessionalizingWarning}}
            <p class="user-certifications-detail-header__info-certificate--professionalizing-warning">
              {{t "pages.certificate.professionalizing-warning"}}</p>
          {{/if}}

          {{#if this.displayCertificationResultsExplanation}}
            <PixButtonLink
              @href={{this.certificationResultsExplanationUrl}}
              target="_blank"
              rel="noopener noreferrer"
              @variant="tertiary"
              @iconAfter="openNew"
            > {{t "pages.certificate.learn-about-certification-results"}}</PixButtonLink>
          {{/if}}

        </div>
      </div>
      {{#if @certification.verificationCode}}
        <div class="attestation-and-verification-code">
          <div class="attestation">
            <PixButton @triggerAction={{this.downloadAttestation}}>
              {{t "pages.certificate.actions.download"}}
            </PixButton>
            {{#if this.attestationDownloadErrorMessage}}
              <p class="attestation__error-message">{{this.attestationDownloadErrorMessage}}</p>
            {{/if}}
          </div>
          <div class="verification-code">
            <h2 class="verification-code__title">
              {{t "pages.certificate.verification-code.title"}}
            </h2>
            <span class="verification-code__box">
              <p class="verification-code__code">{{@certification.verificationCode}}</p>

              {{#if (isClipboardSupported)}}
                <PixTooltip @position="bottom" @isInline={{true}} @id="verification-code-copy-button-tooltip">
                  <:triggerElement>
                    <CopyButton
                      @text={{@certification.verificationCode}}
                      @onSuccess={{this.clipboardSuccess}}
                      class="icon-button"
                      aria-describedby="verification-code-copy-button-tooltip"
                    >
                      <PixIcon
                        class="verification-code__copy-button"
                        @name="copy"
                        @title={{t "pages.certificate.verification-code.alt"}}
                      />
                    </CopyButton>
                  </:triggerElement>
                  <:tooltip>
                    {{this.tooltipText}}
                  </:tooltip>
                </PixTooltip>
              {{/if}}
            </span>
            <p class="verification-code__informations">
              {{t "pages.certificate.verification-code.tooltip"}}
            </p>
          </div>
        </div>
      {{/if}}
    {{/if}}
  </template>
  @service intl;
  @service fileSaver;
  @service session;
  @service currentDomain;
  @service currentUser;
  @service url;

  @tracked tooltipText = this.intl.t('pages.certificate.verification-code.copy');
  @tracked attestationDownloadErrorMessage = null;

  get birthdateMidnightLocalTime() {
    return parseISODateOnly(this.args.certification.birthdate);
  }

  get isUserFrenchReader() {
    return this.currentUser.user && this.currentUser.user.lang === 'fr';
  }

  get displayCertificationResultsExplanation() {
    return this.args.certification.isV3 && (this.currentDomain.isFranceDomain || this.isUserFrenchReader);
  }

  get certificationResultsExplanationUrl() {
    return this.url.certificationResultsExplanationUrl;
  }

  @action
  clipboardSuccess() {
    this.tooltipText = this.intl.t('pages.certificate.verification-code.copied');
  }

  @action
  async downloadAttestation() {
    this.attestationDownloadErrorMessage = null;
    const certificationId = this.args.certification.id;
    const lang = this.intl.primaryLocale;

    const url = `/api/attestation/${certificationId}?isFrenchDomainExtension=${this.currentDomain.isFranceDomain}&lang=${lang}`;

    const token = this.session.data.authenticated.access_token;
    try {
      await this.fileSaver.save({ url, token });
    } catch {
      this.attestationDownloadErrorMessage = this.intl.t('common.error');
    }
  }
}
