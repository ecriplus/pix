import PixBreadcrumb from '@1024pix/pix-ui/components/pix-breadcrumb';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import V2Certificate from 'mon-pix/components/certifications/shareable-certificate/v2-certificate';
import V3Certificate from 'mon-pix/components/certifications/shareable-certificate/v3-certificate';

export default class SharedCertification extends Component {
  @service intl;

  get links() {
    return [
      {
        route: 'fill-in-certificate-verification-code',
        label: this.intl.t('pages.fill-in-certificate-verification-code.title'),
      },
      {
        label: this.args.controller.model.title,
      },
    ];
  }

  <template>
    {{pageTitle (t "pages.shared-certification.title")}}

    <main id="main" class="global-page-container" role="main">
      <section class="global-page-header global-page-header__breadcrumb">
        <PixBreadcrumb @links={{this.links}} />

        <h1 class="global-page-header__title">
          {{@controller.model.title}}
        </h1>
      </section>

      {{#if @controller.displayV3CertificationShared}}
        <V3Certificate @certificate={{@controller.model}} />
      {{else}}
        <V2Certificate @model={{@controller.model}} />
      {{/if}}
    </main>
  </template>
}
