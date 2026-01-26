import pageTitle from 'ember-page-title/helpers/page-title';
import Organizations from 'pix-admin/components/target-profiles/organizations';
<template>
  {{pageTitle "Profil " @model.targetProfile.id " Orgas | Pix Admin" replace=true}}

  <Organizations
    @organizations={{@model.organizations}}
    @administrationTeams={{@model.administrationTeams}}
    @targetProfile={{@model.targetProfile}}
    @id={{@model.params.id}}
    @name={{@model.params.name}}
    @type={{@model.params.type}}
    @externalId={{@model.params.externalId}}
    @hideArchived={{@model.params.hideArchived}}
    @detachOrganizations={{@controller.detachOrganizations}}
    @administrationTeamId={{@model.params.administrationTeamId}}
  />
</template>
