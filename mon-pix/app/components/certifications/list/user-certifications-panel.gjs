import PixBlock from '@1024pix/pix-ui/components/pix-block';
import t from 'ember-intl/helpers/t';
import CertificationsList from 'mon-pix/components/certifications-list';

<template>
  <div class="user-certifications-panel">
    {{#if @certifications}}
      <div class="user-certifications-panel__certifications-list">
        <CertificationsList @certifications={{@certifications}} />
      </div>
    {{else}}
      <PixBlock class="no-certification-panel">
        {{t "pages.certifications-list.no-certification.text"}}
      </PixBlock>
    {{/if}}
  </div>
</template>
