import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import { t } from 'ember-intl';

export default class PixPlusCertificate extends Component {
  @service intl;

  get certificationFrameworkKey() {
    if (this.args.certificate.certificationFramework.toLowerCase().includes('edu')) {
      return 'EDU';
    } else {
      return this.args.certificate.certificationFramework.toUpperCase();
    }
  }

  get certificationFrameworkLabel() {
    return this.intl.t(`pages.certification-frameworks.${this.args.certificate.certificationFramework}`);
  }

  get reachedMeshLabel() {
    return this.intl.t(`pages.user-certifications.meshes.${this.args.certificate.certificationFramework}.0`);
  }

  get frameworkTranslations() {
    const certificationFramework = this.args.certificate.certificationFramework;

    const prefix = certificationFramework.includes('EDU')
      ? 'pages.certificate.frameworks.EDU'
      : `pages.user-certifications.frameworks.${certificationFramework}`;

    return {
      status: this.intl.t(`${prefix}.status`),
      subTitle: this.intl.t(`${prefix}.sub-title`),
      resultsInfos: this.intl.t(`${prefix}.results-infos`, { htmlSafe: true }),
      resultsSubTitle: this.intl.t(`${prefix}.results-sub-title`, { htmlSafe: true }),
    };
  }

  <template>
    <PixBlock class="v3-pix-plus-certificate__infos-block">
      <div>
        <PixTag @color="green" class="v3-pix-plus-certificate__valid-tag">
          <PixIcon @name="check" />
          {{this.frameworkTranslations.status}}
        </PixTag>

        <h2 class="v3-pix-plus-certificate__title">
          <strong>{{this.frameworkTranslations.status}}</strong>
          {{this.frameworkTranslations.subTitle}}
        </h2>

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
      <div>
        <PixTag @color="green">{{this.reachedMeshLabel}}</PixTag>
      </div>
    </PixBlock>

    <PixBlock class="v3-pix-plus-certificate__results-infos-block">
      <img src="/images/illustrations/user-certifications/certificate-magnifier.png" alt="" />
      <div class="v3-pix-plus-certificate__results-infos-details">
        <h3 class="v3-pix-plus-certificate__title">{{t "pages.certificate.results.title"}}</h3>
        <p><strong>{{this.frameworkTranslations.resultsSubTitle}}</strong></p>
        {{this.frameworkTranslations.resultsInfos}}
      </div>
    </PixBlock>
  </template>
}
