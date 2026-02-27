import { action } from '@ember/object';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import t from 'ember-intl/helpers/t';
import ActionsSection from 'pix-admin/components/organizations/children/actions-section';
import List from 'pix-admin/components/organizations/children/list';

export default class OrganizationChildrenComponent extends Component {
  @service accessControl;

  @action
  refreshOrganizationChildren() {
    if (this.args.children && typeof this.args.children.reload === 'function') {
      this.args.children.reload();
    }
  }

  <template>
    {{#if this.accessControl.hasAccessToOrganizationActionsScope}}
      <ActionsSection @onAttachChildSubmitForm={{@onAttachChildSubmitForm}} @organization={{@organization}} />
    {{/if}}

    <section class="page-section">
      <header class="page-section__header">
        <h2 class="page-section__title">{{t "pages.organization-children.title"}}</h2>
      </header>
      {{#if @children}}
        <List @childOrganizations={{@children}} @onRefreshOrganizationChildren={{this.refreshOrganizationChildren}} />
      {{else}}
        <p class="table__empty">{{t "pages.organization-children.empty-table"}}</p>
      {{/if}}
    </section>
  </template>
}
