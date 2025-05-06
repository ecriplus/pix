import Card from 'mon-pix/components/tutorials/card';
<template>
  <ul class="user-tutorials-content__cards">
    {{#each @tutorials as |tutorial|}}
      <Card @tutorial={{tutorial}} @afterRemove={{@afterRemove}} />
    {{/each}}
  </ul>
</template>
