import pageTitle from 'ember-page-title/helpers/page-title';
import TargetProfilesSection from 'pix-admin/components/organizations/target-profiles-section';
<template>
  {{pageTitle "Orga " @model.organization.id " | Profils cibles"}}
  <TargetProfilesSection
    @organization={{@model.organization}}
    @targetProfileSummaries={{@model.targetProfileSummaries}}
    @onAttachTargetProfiles={{@model.onAttachTargetProfiles}}
    @onDetachTargetProfile={{@model.onDetachTargetProfile}}
  />
</template>
