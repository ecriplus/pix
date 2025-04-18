import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { t } from 'ember-intl';

<template>
  <div class="certification-score-information">
    <p>{{t "pages.certificate.certification-value.paragraphs.1"}}</p>
    <p>{{t "pages.certificate.certification-value.paragraphs.2"}}</p>
    <p class="certification-score-information--bold">{{t "pages.certificate.certification-value.paragraphs.3"}}</p>
  </div>

  <PixBlock class="candidate-global-information">
    <div class="candidate-global-information__level">
      <img
        class="candidate-global-information-level__image"
        src="/images/certificate/global-level-image.svg"
        alt=""
        role="presentation"
      />
      <div class="candidate-global-information-level__container">
        <h2>{{t "pages.certificate.global-level"}}</h2>
        <PixTag>{{@certificate.globalLevelLabel}}</PixTag>
      </div>
    </div>
    <div>
      <p class="candidate-global-information--bold">{{@certificate.globalSummaryLabel}}</p>
      <p>{{@certificate.globalDescriptionLabel}}</p>
    </div>
  </PixBlock>
</template>
