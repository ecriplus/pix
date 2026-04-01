import Passage from 'mon-pix/components/module/passage';
<template>
  <div class="modulix">
    <Passage @grainIndex={{@controller.grainIndex}} @module={{@model.module}} @passage={{@model.passage}} />
  </div>
</template>
