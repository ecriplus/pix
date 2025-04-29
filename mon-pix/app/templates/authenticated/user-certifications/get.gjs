import V2Certificate from 'mon-pix/components/certifications/candidate-certificate/v2-certificate';
import V3Certificate from 'mon-pix/components/certifications/candidate-certificate/v3-certificate';
import AppLayout from 'mon-pix/components/global/app-layout';
<template>
  <AppLayout>
    <main id="main" class="global-page-container" role="main">
      {{#if @controller.displayV3CandidateCertificate}}
        <V3Certificate @certificate={{@controller.model}} />
      {{else}}
        <V2Certificate @model={{@controller.model}} />
      {{/if}}
    </main>
  </AppLayout>
</template>
