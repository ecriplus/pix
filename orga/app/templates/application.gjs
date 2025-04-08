import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import Communication from 'pix-orga/components/banner/communication';
import InformationBanners from 'pix-orga/components/banner/information-banners';
<template>
  {{pageTitle @controller.model.title}}
  {{#in-element @controller.model.headElement insertBefore=null}}
    {{! template-lint-disable no-forbidden-elements }}
    <meta name="description" content={{t "application.description"}} />
  {{/in-element}}

  <Communication />
  <InformationBanners @banners={{@controller.model.informationBanner.banners}} />

  {{outlet}}
</template>
