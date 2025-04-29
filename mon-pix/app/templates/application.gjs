import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import CommunicationBanner from 'mon-pix/components/communication-banner';
import InformationBanners from 'mon-pix/components/information-banners';
<template>
  {{! template-lint-disable no-inline-styles }}
  {{pageTitle (t "navigation.pix")}}

  {{#in-element @controller.model.headElement insertBefore=null}}
    {{! template-lint-disable no-forbidden-elements }}
    <meta name="description" content={{t "application.description"}} />
  {{/in-element}}

  <div id="app">
    <div class="pix-communication-banner">
      <CommunicationBanner />
      <InformationBanners @banners={{@controller.model.informationBanner.banners}} />
    </div>

    {{outlet}}

    <!-- Preloading images -->
    <img src="/images/loader-white.svg" alt="{{t 'common.loading.default'}}" style="display: none" />
  </div>
</template>
