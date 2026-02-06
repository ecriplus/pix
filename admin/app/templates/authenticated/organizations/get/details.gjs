import pageTitle from 'ember-page-title/helpers/page-title';
import InformationSection from 'pix-admin/components/organizations/information-section';

<template>
  {{pageTitle "Orga " @model.id " | Détails"}}
  <InformationSection
    @organization={{@model}}
    @onLogoUpdated={{@controller.updateOrganizationInformation}}
    @onSubmit={{@controller.updateOrganizationInformation}}
    @archiveOrganization={{@controller.archiveOrganization}}
  />
</template>
