import List from 'pix-orga/components/catalogue/list';

<template>
  <List
    @courses={{@model.courses}}
    @type={{@model.type}}
    @updateFilter={{@controller.updateFilter}}
    @search={{@controller.search}}
    @categories={{@controller.categories}}
    @resetFilters={{@controller.resetFilters}}
  />
</template>
