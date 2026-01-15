import { service } from '@ember/service';
import Component from '@glimmer/component';
import AttachOrganizationsForm from 'pix-admin/components/organizations/attach-organizations-form';
import ListItems from 'pix-admin/components/organizations/list-items';

export default class Organizations extends Component {
  @service currentUser;

  get isSuperAdminOrMetier() {
    return this.currentUser.adminMember.isSuperAdmin || this.currentUser.adminMember.isMetier;
  }

  <template>
    <section class="page-section organizations-list">
      <header class="page-section__header">
        <h2 class="page-section__title">Organisations</h2>
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
        @showDetachColumn={{this.isSuperAdminOrMetier}}
        @detachOrganizations={{@detachOrganizations}}
        @confirmationLabel="components.combined-course-blueprints.organizations.detach-organization"
      />
    </section>
  </template>
}
