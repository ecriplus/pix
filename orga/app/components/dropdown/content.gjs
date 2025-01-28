import onClickOutside from 'ember-click-outside/modifiers/on-click-outside';

<template>
  {{#if @display}}
    <ul class="dropdown__content" ...attributes {{onClickOutside @close}}>
      {{yield}}
    </ul>
  {{/if}}
</template>
