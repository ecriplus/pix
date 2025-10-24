import { action } from '@ember/object';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import pageTitle from 'ember-page-title/helpers/page-title';
import AttachChildForm from 'pix-admin/components/organizations/children/attach-child-form';
import List from 'pix-admin/components/organizations/children/list';

export default class Children extends Component {
  @action
  refreshOrganizationChildren() {
    this.args.model.children.reload();
  }

  <template>
    {{pageTitle "Children"}}
    {{#if @controller.accessControl.hasAccessToAttachChildOrganizationActionsScope}}
      <section class="page-section">
        <div class="content-text content-text--small">
          <AttachChildForm @onFormSubmitted={{@controller.handleFormSubmitted}} />
        </div>
      </section>
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
