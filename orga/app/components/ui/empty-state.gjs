import PixBlock from '@1024pix/pix-ui/components/pix-block';

<template>
  <PixBlock class="empty-state">
    <img src="{{this.rootURL}}/images/empty-state-participants.svg" alt="" role="none" />
    <p class="participants-empty-state__text">{{@infoText}}</p>
    <p class="participants-empty-state__text">{{@actionText}}</p>
  </PixBlock>
</template>
