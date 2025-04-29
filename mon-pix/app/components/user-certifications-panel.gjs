import CertificationsList from 'mon-pix/components/certifications-list';
import NoCertificationPanel from 'mon-pix/components/no-certification-panel';
<template>
  <div class="user-certifications-panel">
    {{#if @certifications}}
      <div class="user-certifications-panel__certifications-list">
        <CertificationsList @certifications={{@certifications}} />
      </div>
    {{else}}
      <div class="user-certifications-panel__no-certification-panel">
        <NoCertificationPanel />
      </div>
    {{/if}}
  </div>
</template>
