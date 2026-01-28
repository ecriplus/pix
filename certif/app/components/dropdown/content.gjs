import onClickOutside from 'ember-click-outside/modifiers/on-click-outside';
import onKey from 'ember-keyboard/modifiers/on-key';

<template>
  {{#if @display}}
    <ul {{onClickOutside @close}} {{onKey 'Escape' @close}} class='dropdown__content' ...attributes>
      {{yield}}
    </ul>
  {{/if}}
</template>
