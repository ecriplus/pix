import { concat } from '@ember/helper';
<template>
  <th class='{{if @size (concat "table__column--" @size) "table__column"}}' ...attributes>
    {{yield}}
  </th>
</template>
