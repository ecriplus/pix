import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import CertificationVerificationCodeForm from 'mon-pix/components/certification-verification-code-form';
import AppLayout from 'mon-pix/components/global/app-layout';
<template>
  {{pageTitle (t "pages.fill-in-certificate-verification-code.title")}}

  <AppLayout>
    <main id="main" role="main" class="global-page-container">
      <CertificationVerificationCodeForm
        @checkCertificate={{@controller.checkCertificate}}
        @apiErrorMessage={{@controller.apiErrorMessage}}
        @clearErrors={{@controller.clearErrors}}
      />
    </main>
  </AppLayout>
</template>
