import { action } from '@ember/object';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import ActionsSection from 'pix-admin/components/organizations/children/actions-section';
import List from 'pix-admin/components/organizations/children/list';

export default class Children extends Component {
  @action
  refreshOrganizationChildren() {
    this.args.model.children.reload();
  }

  <template>
    {{pageTitle "Children"}}
    {{#if @controller.accessControl.hasAccessToOrganizationActionsScope}}

      <ActionsSection
        @onAttachChildSubmitForm={{@controller.handleFormSubmitted}}
        @organization={{@model.organization}}
      />
    {{/if}}

    <section class="page-section">
      <header class="page-section__header">
        <h2 class="page-section__title">{{t "pages.organization-children.title"}}</h2>
      </header>
      {{#if @model.children}}
        <List
          @childOrganizations={{@model.children}}
          @onRefreshOrganizationChildren={{this.refreshOrganizationChildren}}
        />

      {{else}}
        <p class="table__empty">{{t "pages.organization-children.empty-table"}}</p>
      {{/if}}

    </section>
  </template>
}
