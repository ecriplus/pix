import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';

<template>
  <th class="attach-badges-header">
    <span class="attach-badges-header__content">
      {{yield}}
      {{#unless @isOptionnal}}
        <abbr title="obligatoire" class="mandatory-mark">*</abbr>
      {{/unless}}
      {{#if (has-block "tooltip")}}
        <PixTooltip role="tooltip" @isLight={{true}} @isWide={{true}} @position="bottom-left" class="content_tooltip">
          <:triggerElement>
            <PixIcon @name="info" @plainIcon={{true}} @ariaHidden={{true}} />
          </:triggerElement>
          <:tooltip>{{yield to="tooltip"}}</:tooltip>
        </PixTooltip>
      {{/if}}
    </span>
  </th>
</template>
