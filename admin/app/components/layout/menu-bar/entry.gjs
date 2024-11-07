import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixTooltip from '@1024pix/pix-ui/components/pix-tooltip';
import { LinkTo } from '@ember/routing';

<template>
  <li class="menu-bar__entry">
    <PixTooltip @position="right" ...attributes>
      <:triggerElement>
        <LinkTo @route={{@path}}>
          <PixIcon @name={{@icon}} @title={{@title}} @plainIcon={{true}} />
        </LinkTo>
      </:triggerElement>
      <:tooltip>{{@title}}</:tooltip>
    </PixTooltip>
  </li>
</template>
