import { LinkTo } from '@ember/routing';

<template>
  <li class="dropdown__item dropdown__item--link">
    <LinkTo @route={{@linkTo}} class="link" ...attributes>
      {{yield}}
    </LinkTo>
  </li>
</template>
