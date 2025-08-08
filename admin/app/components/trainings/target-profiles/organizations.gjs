import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixFilterBanner from '@1024pix/pix-ui/components/pix-filter-banner';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixPagination from '@1024pix/pix-ui/components/pix-pagination';
import PixSelect from '@1024pix/pix-ui/components/pix-select';
import PixTable from '@1024pix/pix-ui/components/pix-table';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { fn } from '@ember/helper';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { t } from 'ember-intl';

export default class Organizations extends Component {
  optionType = [
    { value: 'PRO', label: 'PRO' },
    { value: 'SCO', label: 'SCO' },
    { value: 'SCO-1D', label: 'SCO-1D' },
    { value: 'SUP', label: 'SUP' },
  ];

  searchedId = this.args.controller.id;
  searchedName = this.args.controller.name;
  searchedExternalId = this.args.controller.externalId;
  searchedType = this.args.controller.type;

  <template>
    <section class="page-section organizations-list">

      <h2 class="page-section__title">{{@targetProfile.internalName}}</h2>
      <h3>Filtrer par organisations</h3>

      <PixFilterBanner @title={{t "common.filters.title"}}>
        <PixInput value={{this.searchedId}} oninput={{fn @controller.triggerFiltering "id"}}>
          <:label>Identifiant</:label>
        </PixInput>
        <PixInput value={{this.searchedName}} oninput={{fn @controller.triggerFiltering "name"}}>
          <:label>Nom</:label>
        </PixInput>
        <PixSelect
          @id="type"
          @hideDefaultOption={{true}}
          @options={{this.optionType}}
          @onChange={{@controller.filter}}
          @value={{@controller.type}}
        >
          <:label>Type</:label>
        </PixSelect>
        <PixInput value={{this.searchedExternalId}} oninput={{fn @controller.triggerFiltering "externalId"}}>
          <:label>Identifiant externe</:label>
        </PixInput>
      </PixFilterBanner>

      <PixTable
        @variant="admin"
        @caption={{t "components.organizations.list-items.table.caption"}}
        @data={{@organizations}}
      >
        <:columns as |organization context|>
          <PixTableColumn @context={{context}}>
            <:header>
              ID
            </:header>
            <:cell>
              <LinkTo @route="authenticated.organizations.get" @model={{organization.id}}>
                {{organization.id}}
              </LinkTo>
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}} class="break-word">
            <:header>
              Nom
            </:header>
            <:cell>
              {{organization.name}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              Type
            </:header>
            <:cell>
              {{organization.type}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}} class="break-word">
            <:header>
              Identifiant externe
            </:header>
            <:cell>
              {{organization.externalId}}
            </:cell>
          </PixTableColumn>
          {{#if @showDetachColumn}}
            <PixTableColumn @context={{context}}>
              <:header>
                Actions
              </:header>
              <:cell>
                <PixButton @variant="error" @size="small" @triggerAction={{fn this.openModal organization}}>
                  Détacher
                </PixButton>
              </:cell>
            </PixTableColumn>
          {{/if}}
        </:columns>
      </PixTable>

      <PixPagination @pagination={{@organizations.meta}} />

      <ul class="edit-training-trigger__actions">
        <li>
          <PixButton @variant="secondary" @size="small" @triggerAction={{this.onCancel}}>
            Annuler
          </PixButton>
        </li>
        <li>
          <PixButton @variant="success" @size="small" @type="submit" @isLoading={{this.submitting}}>
            Enregistrer
          </PixButton>
        </li>
      </ul>
    </section>
  </template>
}
