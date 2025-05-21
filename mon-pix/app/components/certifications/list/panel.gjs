import PixBlock from '@1024pix/pix-ui/components/pix-block';
import t from 'ember-intl/helpers/t';
import Item from 'mon-pix/components/certifications/list/item';

<template>
  {{#if @certifications}}
    <div class="certifications-panel">
      {{#each @certifications as |certification|}}
        <PixBlock class="certifications-panel-item">
          <Item @certification={{certification}} />
        </PixBlock>
      {{/each}}
    </div>
  {{else}}
    <PixBlock class="no-certification-panel">
      {{t "pages.certifications-list.no-certification.text"}}
    </PixBlock>
  {{/if}}
</template>
