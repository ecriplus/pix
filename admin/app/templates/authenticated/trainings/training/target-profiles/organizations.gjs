import { fn } from "@ember/helper";
import { action } from "@ember/object";
import { LinkTo } from "@ember/routing";
import { tracked } from "@glimmer/tracking";
import { t } from "ember-intl";
import { not } from "ember-truth-helpers";
import { debounceTask } from "ember-lifeline";

import PixButton from "@1024pix/pix-ui/components/pix-button";
import PixPagination from "@1024pix/pix-ui/components/pix-pagination";
import PixTable from "@1024pix/pix-ui/components/pix-table";
import PixTableColumn from "@1024pix/pix-ui/components/pix-table-column";
import Component from "@glimmer/component";

export default class Organizations extends Component {
  <template>
    <section class="page-section organizations-list">

      <h2 class="page-section__title">{{@model.targetProfile.internalName}}</h2>
      <h3>Filtrer par organisations</h3>

      <PixTable
        @variant="admin"
        @caption={{t "components.organizations.list-items.table.caption"}}
        @data={{@model.organizations}}
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

      <PixPagination @pagination={{@model.organizations.meta}} />

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
