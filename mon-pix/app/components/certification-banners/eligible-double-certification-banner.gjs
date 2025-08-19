import t from 'ember-intl/helpers/t';
<template>
  <div class="congratulations-banner__double-certification">
    <div class="congratulations-banner-double-certification__icons">
      <img src={{@doubleCertification.imageUrl}} alt={{@doubleCertification.label}} />
    </div>
    <div class="congratulations-banner-double-certification__list">
      <p class="congratulations-banner-double-certification-list__message">
        {{t "pages.certification-joiner.congratulation-banner.double-certification.eligible" htmlSafe=true}}
      </p>
      <p>{{@doubleCertification.label}}</p>
    </div>
  </div>
</template>
