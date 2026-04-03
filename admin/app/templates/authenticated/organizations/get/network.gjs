import pageTitle from 'ember-page-title/helpers/page-title';
import Network from 'pix-admin/components/organizations/network';

<template>
  {{pageTitle "Orga " @model.organization.id " | Réseau"}}
  <Network @organization={{@model.organization}} @children={{@model.children}} />
</template>
