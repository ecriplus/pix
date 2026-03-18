import PixIconButton from '@1024pix/pix-ui/components/pix-icon-button';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import t from 'ember-intl/helpers/t';
import CopyButton from 'pix-admin/components/ui/copy-button';

<template>
  <div class="network__title-section">
    <div class="network__name-row">
      <h1 class="network__name">{{@network.name}}</h1>
      <PixTooltip @id="edit-network-tooltip" @position="top" @isInline={{true}}>
        <:triggerElement>
          <PixIconButton
            @iconName="edit"
            @ariaLabel={{t "common.actions.edit"}}
            @size="small"
            @triggerAction={{@onEdit}}
            aria-describedby="edit-network-tooltip"
          />
        </:triggerElement>
        <:tooltip>{{t "components.networks.editing.actions.edit-tooltip"}}</:tooltip>
      </PixTooltip>
    </div>
    <div class="network__id">
      <p>ID : <span>{{@network.id}}</span></p>
      <CopyButton
        @id="copy-network-id"
        @value={{@network.id}}
        @tooltip={{t "components.networks.copy-id"}}
        @label={{t "components.networks.copy-id"}}
      />
    </div>
  </div>
</template>
