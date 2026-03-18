import pageTitle from 'ember-page-title/helpers/page-title';
import FeaturesSection from 'pix-admin/components/organizations/features-section';

<template>
  {{pageTitle "Orga " @model.id " | Fonctionnalités"}}
  <FeaturesSection @organization={{@model}} @onSubmit={{@controller.updateOrganizationInformation}} />
</template>
