import PixTabs from '@1024pix/pix-ui/components/pix-tabs';
import { LinkTo } from '@ember/routing';
import t from 'ember-intl/helpers/t';
import Breadcrumb from 'pix-admin/components/organizations/breadcrumb';
import InformationSection from 'pix-admin/components/organizations/information-section';
<template>
  <header class="page-header">
    <Breadcrumb @currentPageLabel={{@model.name}} />
  </header>

  <main class="page-body" id="organizations-get-page">

    <InformationSection
      @organization={{@model}}
      @onLogoUpdated={{@controller.updateOrganizationInformation}}
      @onSubmit={{@controller.updateOrganizationInformation}}
      @archiveOrganization={{@controller.archiveOrganization}}
    />

    <PixTabs @variant="primary" @ariaLabel="Navigation de la section organisation" class="navigation">

      {{#unless @model.isArchived}}
        <LinkTo @route="authenticated.organizations.get.team" @model={{@model}}>
          {{t "pages.organization.navbar.team"}}
        </LinkTo>

        <LinkTo @route="authenticated.organizations.get.invitations" @model={{@model}}>
          {{t "pages.organization.navbar.invitations"}}
        </LinkTo>
      {{/unless}}

      <LinkTo @route="authenticated.organizations.get.target-profiles" @model={{@model}}>
        {{t "pages.organization.navbar.target-profiles"}}
      </LinkTo>

      <LinkTo @route="authenticated.organizations.get.campaigns" @model={{@model}}>
        {{t "pages.organization.navbar.campaigns"}}
      </LinkTo>

      <LinkTo @route="authenticated.organizations.get.places" @model={{@model}}>
        {{t "pages.organization.navbar.places"}}
      </LinkTo>
      {{#if @controller.accessControl.hasAccessToOrganizationActionsScope}}
        <LinkTo @route="authenticated.organizations.get.all-tags" @model={{@model}}>
          {{t "pages.organization.navbar.tags"}}
        </LinkTo>
      {{/if}}
      <LinkTo @route="authenticated.organizations.get.children" @model={{@model}}>
        {{t "pages.organization.navbar.children"}}
        ({{@model.children.length}})
      </LinkTo>
    </PixTabs>

    {{outlet}}
  </main>
</template>
