import PixIcon from '@1024pix/pix-ui/components/pix-icon';

<template>
  <div class="explanation-card" ...attributes>
    <span class="explanation-card__title">
      <PixIcon @name="help" @plainIcon={{true}} class="explanation-card__icon" />
      <span>{{yield to="title"}}</span>
    </span>
    <p class="explanation-card__message">
      {{yield to="message"}}
    </p>
  </div>
</template>
