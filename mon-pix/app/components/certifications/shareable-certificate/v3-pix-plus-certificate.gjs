import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixStepper from '@1024pix/pix-ui/components/pix-stepper';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import { t } from 'ember-intl';
import { eq } from 'ember-truth-helpers';
import { CERTIFICATE_TYPES } from 'mon-pix/models/certificate-summary';

import Hexagon from '../../user-certifications/list-item/hexagon';

export default class PixPlusCertificate extends Component {
  @service intl;

  @tracked eduCurrentStep = this.args.certificate.level === 'ADMISSIBLE' ? 2 : 3;

  get isEduCertification() {
    return this.args.certificate.certificationFramework.includes('EDU');
  }

  get certificationFrameworkLabel() {
    return this.intl.t(`pages.certification-frameworks.${this.args.certificate.certificationFramework}`);
  }

  get reachedMeshLabel() {
    return this.intl.t(
      `pages.user-certifications.meshes.${this.args.certificate.certificationFramework}.${this.args.certificate.level}`,
    );
  }

  get certificationSubTitle() {
    if (this.isEduCertification) {
      return this.intl.t('pages.certificate.frameworks.EDU.sub-title');
    }
    return this.intl.t('pages.certificate.obtained-certification', {
      frameworkLabel: this.certificationFrameworkLabel,
    });
  }

  get frameworkTranslations() {
    return {
      resultsInfos: this.intl.t('pages.certificate.frameworks.EDU.results-infos', { htmlSafe: true }),
      resultsSubTitle: this.intl.t('pages.certificate.frameworks.EDU.results-sub-title', { htmlSafe: true }),
    };
  }

  get steps() {
    return [
      { title: this.intl.t('pages.certificate.frameworks.EDU.steps.1') },
      { title: this.intl.t('pages.certificate.frameworks.EDU.steps.2', { htmlSafe: true }) },
      { title: this.intl.t('pages.certificate.frameworks.EDU.steps.3') },
    ];
  }

  <template>
    <PixBlock class="v3-pix-plus-certificate__infos-block">
      <div>
        <PixTag @color="green" class="v3-pix-plus-certificate__valid-tag">
          <PixIcon @name="check" />
          {{t "pages.certificate.valid-status"}}
        </PixTag>

        <h2 class="v3-pix-plus-certificate__title">
          <strong>{{t "pages.certificate.valid-status"}}</strong>
          {{this.certificationSubTitle}}
        </h2>

        {{#if this.isEduCertification}}
          <PixStepper
            class="v3-pix-plus-certificate__stepper"
            @steps={{this.steps}}
            @currentStep={{this.eduCurrentStep}}
          />
        {{/if}}

        <div class="v3-pix-plus-certificate__details">
          <p>
            <strong>
              {{t "pages.certificate.candidate"}}
              {{@certificate.firstName}}
              {{@certificate.lastName}}
            </strong><br />
            {{t
              "pages.certificate.candidate-birth-complete"
              birthdate=(dayjsFormat @certificate.birthdate "DD/MM/YYYY")
              birthplace=@certificate.birthplace
            }}
          </p>
          <dl>
            <dt><strong>{{t "pages.certificate.certification-center"}}</strong></dt>
            <dd><strong>{{@certificate.certificationCenter}}</strong></dd>

            <dt>{{t "pages.certificate.certification-date"}}</dt>
            <dd>{{dayjsFormat @certificate.certificationDate "DD/MM/YYYY"}}</dd>

            <dt>{{t "pages.certificate.delivered-at"}}</dt>
            <dd>{{dayjsFormat @certificate.deliveredAt "DD/MM/YYYY"}}</dd>
          </dl>
        </div>
      </div>
      <div class="v3-pix-plus-certificate__score">
        <Hexagon
          @framework={{@certificate.certificationFramework}}
          @certificateType={{CERTIFICATE_TYPES.CERTIFICATE}}
          @reachedMeshLevel={{@certificate.level}}
        />
        {{#if (eq this.eduCurrentStep 2)}}
          <PixTag @color="green">{{this.reachedMeshLabel}}</PixTag>
        {{/if}}
      </div>
    </PixBlock>

    {{#if this.isEduCertification}}
      <PixBlock class="v3-pix-plus-certificate__results-infos-block">
        <img src="/images/illustrations/user-certifications/certificate-magnifier.png" alt="" />
        <div class="v3-pix-plus-certificate__results-infos-details">
          <h3 class="v3-pix-plus-certificate__title">{{t "pages.certificate.results.title"}}</h3>
          <p><strong>{{this.frameworkTranslations.resultsSubTitle}}</strong></p>
          {{this.frameworkTranslations.resultsInfos}}
        </div>
      </PixBlock>
    {{/if}}
  </template>
}
