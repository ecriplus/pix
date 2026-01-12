import ListItems from 'pix-admin/components/organizations/list-items';

<template>
  <section class="page-section organizations-list">
    <header class="page-section__header">
      <h2 class="page-section__title">Organisations pouet</h2>
    </header>

    <ListItems
      @organizations={{@organizations}}
      @administrationTeams={{@administrationTeams}}
      @triggerFiltering={{@triggerFiltering}}
      @onResetFilter={{@onResetFilter}}
      @goToOrganizationPage={{@goToOrganizationPage}}
      @entityName={{@blueprint.internalName}}
      @id={{@id}}
      @name={{@name}}
      @hideArchived={{@hideArchived}}
      @type={{@type}}
      @externalId={{@externalId}}
      @administrationTeamId={{@administrationTeamId}}
    />
  </section>
</template>
