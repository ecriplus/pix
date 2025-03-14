import PixBlock from '@1024pix/pix-ui/components/pix-block';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { t } from 'ember-intl';

<template>
  <PixBlock class="chart-card" ...attributes>
    <h3 class="chart-card__title">
      {{@title}}
      {{#if @info}}<PixTooltip @isWide={{true}} @position="left">
          <:triggerElement>
            <PixIcon @name="help" class="chart-card__tooltip-icon" @plainIcon={{true}} @ariaHidden={{true}} />
          </:triggerElement>
          <:tooltip>
            {{t "cards.badges-acquisitions.information"}}
          </:tooltip>
        </PixTooltip>{{/if}}
    </h3>
    {{yield}}
  </PixBlock>
</template>
