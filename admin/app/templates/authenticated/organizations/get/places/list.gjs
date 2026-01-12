import pageTitle from 'ember-page-title/helpers/page-title';
import Places from 'pix-admin/components/organizations/places';
<template>
  {{pageTitle "Orga " @model.organization.id " | Places"}}
  <Places
    @places={{@model.places}}
    @organizationId={{@model.organization.id}}
    @placesCapacity={{@model.placesCapacity}}
    @placesStatistics={{@model.placesStatistics}}
    @refreshModel={{@controller.refresh}}
  />
</template>
