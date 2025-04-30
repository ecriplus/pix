import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import V2Certificate from 'mon-pix/components/certifications/shareable-certificate/v2-certificate';
import V3Certificate from 'mon-pix/components/certifications/shareable-certificate/v3-certificate';

<template>
  {{pageTitle (t "pages.shared-certification.title")}}

  <main id="main" class="global-page-container" role="main">
    {{#if @controller.displayV3CertificationShared}}
      <V3Certificate @certificate={{@controller.model}} />
    {{else}}
      <V2Certificate @model={{@controller.model}} />
    {{/if}}
  </main>
</template>
