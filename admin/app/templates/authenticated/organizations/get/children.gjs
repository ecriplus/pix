import pageTitle from 'ember-page-title/helpers/page-title';
import Children from 'pix-admin/components/organizations/children';

<template>
  {{pageTitle "Orga " @model.organization.id " | Organisations filles"}}
  <Children
    @organization={{@model.organization}}
    @children={{@model.children}}
    @onAttachChildSubmitForm={{@controller.handleFormSubmitted}}
  />
</template>
