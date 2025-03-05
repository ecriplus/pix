import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';

import IsCertifiable from '../ui/is-certifiable';

function displayCertificabilityDate(hideCertifiableDate, isCertifiable) {
  return !hideCertifiableDate && isCertifiable !== null;
}

<template>
  <IsCertifiable @isCertifiable={{@isCertifiable}} />
  {{#if (displayCertificabilityDate @hideCertifiableDate @isCertifiable)}}
    <span>{{dayjsFormat @certifiableAt "DD/MM/YYYY" allow-empty=true}}</span>
  {{/if}}
</template>
