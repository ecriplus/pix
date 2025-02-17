import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixModal from '@1024pix/pix-ui/components/pix-modal';
import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { t } from 'ember-intl';
import { not } from 'ember-truth-helpers';

export default class ActionsOnUsersRoleInOrganization extends Component {
  @tracked showModal = false;
  @tracked organizationToDetach;

  searchedId = this.args.id;
  searchedName = this.args.name;
  searchedExternalId = this.args.externalId;

  optionType = [
    { value: 'PRO', label: 'PRO' },
    { value: 'SCO', label: 'SCO' },
    { value: 'SCO-1D', label: 'SCO-1D' },
    { value: 'SUP', label: 'SUP' },
  ];

  @action
  openModal(organization) {
    this.showModal = true;
    this.organizationToDetach = organization;
  }

  @action
  closeModal() {
    this.showModal = false;
    this.organizationToDetach = null;
  }

  @action
  async detachOrganizations(organizationId) {
    await this.args.detachOrganizations(organizationId);
    this.closeModal();
  }

  @action
  filter(value) {
    const event = { target: { value } };
    this.args.triggerFiltering('type', event);
  }

  <template>
    <div class="content-text content-text--small">
      <div class="table-admin">
        <table>
          <thead>
            <tr>
              <th class="table__column table__column--id"><label for="id">ID</label></th>
              <th><label for="name">Nom</label></th>
              <th><label for="type">Type</label></th>
              <th><label for="externalId">Identifiant externe</label></th>
              {{#if @showDetachColumn}}
                <th>Actions</th>
              {{/if}}
            </tr>
            <tr>
              <td class="table__column table__column--id">
                <PixInput id="id" type="text" value={{this.searchedId}} oninput={{fn @triggerFiltering "id"}} />
              </td>
              <td>
                <PixInput id="name" type="text" value={{this.searchedName}} oninput={{fn @triggerFiltering "name"}} />
              </td>
              <td>
                <PixSelect
                  @id="type"
                  @options={{this.optionType}}
                  @placeholder="- Type -"
                  @onChange={{this.filter}}
                  @value={{@type}}
                />
              </td>
              <td>
                <PixInput
                  id="externalId"
                  type="text"
                  value={{this.searchedExternalId}}
                  oninput={{fn @triggerFiltering "externalId"}}
                />
              </td>
              {{#if @showDetachColumn}}
                <td></td>
              {{/if}}
            </tr>
          </thead>

          {{#if @organizations}}
            <tbody>
              {{#each @organizations as |organization|}}
                <tr aria-label="Organisation {{organization.name}}">
                  <td class="table__column table__column--id">
                    <LinkTo @route="authenticated.organizations.get" @model={{organization.id}}>
                      {{organization.id}}
                    </LinkTo>
                  </td>
                  <td>{{organization.name}}</td>
                  <td>{{organization.type}}</td>
                  <td>{{organization.externalId}}</td>
                  {{#if @showDetachColumn}}
                    <td>
                      <PixButton @variant="error" @size="small" @triggerAction={{fn this.openModal organization}}>
                        Détacher
                      </PixButton>

                    </td>
                  {{/if}}
                </tr>
              {{/each}}
            </tbody>
          {{/if}}
        </table>

        {{#unless @organizations}}
          <div class="table__empty">{{t "common.tables.empty-result"}}</div>
        {{/unless}}
      </div>
    </div>

    {{#if @organizations}}
      <PixPagination @pagination={{@organizations.meta}} />
    {{/if}}

    <PixModal
      @title="Détacher l'organisation du profil cible"
      @onCloseButtonClick={{this.closeModal}}
      @showModal={{this.showModal}}
      aria-hidden="{{not this.showModal}}"
    >
      <:content>
        <p>
          Etes-vous sûr de vouloir détacher l'organisation
          <strong>{{this.organizationToDetach.name}}</strong>
          du profil cible
          <strong>{{@targetProfileName}}</strong>
          ?
        </p>
      </:content>
      <:footer>
        <PixButton @variant="secondary" @triggerAction={{this.closeModal}}>
          {{t "common.actions.cancel"}}
        </PixButton>
        <PixButton
          @variant="error"
          @triggerAction={{fn this.detachOrganizations this.organizationToDetach.id}}
        >Confirmer</PixButton>
      </:footer>
    </PixModal>
  </template>
}
