import t from 'ember-intl/helpers/t';
<template>
  <div class="oudated-double-certification-banner">
    <div class="oudated-double-certification-banner__row">
      <img
        class="oudated-double-certification-banner__icon"
        src={{@doubleCertification.imageUrl}}
        alt={{@doubleCertification.label}}
      />
      <p class="oudated-double-certification-banner__message">
        {{t
          "pages.certification-joiner.congratulation-banner.double-certification.outdated"
          doubleCertificationName=@doubleCertification.label
          htmlSafe=true
        }}
      </p>
    </div>
  </div>
</template>
