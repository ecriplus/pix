import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { fn } from '@ember/helper';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';
import formatDate from 'pix-admin/helpers/format-date';

export default class OrganizationLearnerInformation extends Component {
  @service accessControl;

  <template>
    <header class="page-section__header">
      <h2 class="page-section__title">Informations prescrit</h2>
    </header>

    {{#if @user.organizationLearners}}
      <PixTable
        @variant="admin"
        @caption={{t "components.users.organization-learner-information.table.caption"}}
        @data={{@user.organizationLearners}}
      >
        <:columns as |organizationLearner context|>
          <PixTableColumn @context={{context}} class="break-word">
            <:header>
              Prénom
            </:header>
            <:cell>
              {{organizationLearner.firstName}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}} class="break-word">
            <:header>
              Nom
            </:header>
            <:cell>
              {{organizationLearner.lastName}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              DDN
            </:header>
            <:cell>
              {{formatDate organizationLearner.birthdate}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              Classe / Groupe
            </:header>
            <:cell>
              {{if organizationLearner.division organizationLearner.division}}
              {{if organizationLearner.group organizationLearner.group}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}} class="break-word">
            <:header>
              Organisation
            </:header>
            <:cell>
              <LinkTo @route="authenticated.organizations.get" @model={{organizationLearner.organizationId}}>
                {{organizationLearner.organizationName}}
              </LinkTo>
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              Création
            </:header>
            <:cell>
              {{formatDate organizationLearner.createdAt}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              Dernière MAJ
            </:header>
            <:cell>
              {{formatDate organizationLearner.updatedAt}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}} class="table-admin-organization-learners-status">
            <:header>
              Actif
            </:header>
            <:cell>
              {{#if organizationLearner.isDisabled}}
                <PixIcon
                  @name="cancel"
                  @plainIcon={{true}}
                  @ariaHidden={{false}}
                  aria-label="Inscription désactivée"
                  class="organization-learners-table__status--isDisabled"
                />
              {{else}}
                <PixIcon
                  @name="checkCircle"
                  @plainIcon={{true}}
                  @ariaHidden={{false}}
                  aria-label="Inscription activée"
                  class="organization-learners-table__status--isEnabled"
                />
              {{/if}}
            </:cell>
          </PixTableColumn>
          {{#if this.accessControl.hasAccessToUsersActionsScope}}
            <PixTableColumn @context={{context}}>
              <:header>
                Actions
              </:header>
              <:cell>
                {{#if organizationLearner.canBeDissociated}}
                  <PixButton
                    @triggerAction={{fn @toggleDisplayDissociateModal organizationLearner}}
                    @size="small"
                    @variant="error"
                  >
                    Dissocier
                  </PixButton>
                {{/if}}
              </:cell>
            </PixTableColumn>
          {{/if}}
        </:columns>
      </PixTable>
    {{else}}
      <p class="table__empty">{{t "common.tables.empty-result"}}</p>
    {{/if}}
  </template>
}
