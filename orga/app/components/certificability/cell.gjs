import { formatDate } from 'ember-intl';

import IsCertifiable from '../ui/is-certifiable';

function displayCertificabilityDate(hideCertifiableDate, isCertifiable) {
  return !hideCertifiableDate && isCertifiable !== null;
}

<template>
  <IsCertifiable @isCertifiable={{@isCertifiable}} />
  {{#if (displayCertificabilityDate @hideCertifiableDate @isCertifiable)}}
    <span>{{formatDate @certifiableAt}}</span>
  {{/if}}
</template>
