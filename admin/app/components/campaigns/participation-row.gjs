import PixButton from '@1024pix/pix-ui/components/pix-button';
import PixIcon from '@1024pix/pix-ui/components/pix-icon';
import PixInput from '@1024pix/pix-ui/components/pix-input';
import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import { action } from '@ember/object';
import { LinkTo } from '@ember/routing';
import { service } from '@ember/service';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import { t } from 'ember-intl';
import { and } from 'ember-truth-helpers';

export default class ParticipationRow extends Component {
  @service accessControl;

  @tracked isEditionMode = false;
  @tracked newParticipantExternalId;

  _checkIfParticipantExternalIdIsNull(newParticipantExternalId) {
    const trimedNewParticipantExternalId = newParticipantExternalId.trim();
    return trimedNewParticipantExternalId || null;
  }

  @action
  updateParticipantExternalId() {
    this.isEditionMode = false;
    this.args.participation.participantExternalId = this._checkIfParticipantExternalIdIsNull(
      this.newParticipantExternalId,
    );
    return this.args.updateParticipantExternalId(this.args.participation);
  }

  @action
  cancelUpdateParticipantExternalId() {
    this.isEditionMode = false;
    this.newParticipantExternalId = null;
  }

  @action
  editParticipantExternalId() {
    this.isEditionMode = true;
    this.newParticipantExternalId = null;
  }

  @action
  handleChange(e) {
    this.newParticipantExternalId = e.target.value;
  }

  <template>
    <PixTableColumn @context={{@context}}>
      <:header>Prescrit lié</:header>
      <:cell>{{@participation.firstName}} {{@participation.lastName}}</:cell>
    </PixTableColumn>

    <PixTableColumn @context={{@context}}>
      <:header>Compte lié</:header>
      <:cell>
        {{#if @participation.userId}}
          <LinkTo @route="authenticated.users.get" @model={{@participation.userId}}>
            {{@participation.userFullName}}
          </LinkTo>
        {{else}}
          {{@participation.userFullName}}
        {{/if}}
      </:cell>
    </PixTableColumn>

    {{#if @externalIdLabel}}
      <PixTableColumn @context={{@context}}>
        <:header>{{@externalIdLabel}}</:header>
        <:cell>
          {{#if this.isEditionMode}}
            <PixInput
              type="text"
              @id="participantExternalId"
              @screenReaderOnly={{true}}
              value={{@participation.participantExternalId}}
              onchange={{this.handleChange}}
              class="table-admin-input form-control"
            >
              <:label>Modifier l'identifiant externe du participant</:label>
            </PixInput>
          {{else}}
            {{@participation.participantExternalId}}
          {{/if}}
        </:cell>
      </PixTableColumn>
    {{/if}}

    <PixTableColumn @context={{@context}}>
      <:header>Date de début</:header>
      <:cell>{{dayjsFormat @participation.createdAt "DD/MM/YYYY"}}</:cell>
    </PixTableColumn>

    <PixTableColumn @context={{@context}}>
      <:header>Statut</:header>
      <:cell>{{@participation.displayedStatus}}</:cell>
    </PixTableColumn>

    <PixTableColumn @context={{@context}}>
      <:header>Date d'envoi</:header>
      <:cell>{{if @participation.sharedAt (dayjsFormat @participation.sharedAt "DD/MM/YYYY") "-"}}</:cell>
    </PixTableColumn>

    <PixTableColumn @context={{@context}}>
      <:header>Supprimée le</:header>
      <:cell>
        {{#if @participation.deletedAt}}
          {{dayjsFormat @participation.deletedAt "DD/MM/YYYY"}}
          par
          <LinkTo @route="authenticated.users.get" @model={{@participation.deletedBy}}>
            {{@participation.deletedByFullName}}
          </LinkTo>
        {{else}}
          -
        {{/if}}
      </:cell>
    </PixTableColumn>

    {{#if (and this.accessControl.hasAccessToOrganizationActionsScope @externalIdLabel)}}
      <PixTableColumn @context={{@context}}>
        <:header>Actions</:header>
        <:cell>
          {{#if this.isEditionMode}}
            <div class="participation-item-actions__modify">
              <PixButton @size="small" @triggerAction={{this.updateParticipantExternalId}}>
                {{t "common.actions.save"}}
              </PixButton>
              <PixButton
                @size="small"
                @variant="secondary"
                @triggerAction={{this.cancelUpdateParticipantExternalId}}
                aria-label={{t "common.actions.cancel"}}
              >
                <PixIcon @name="close" @ariaHidden={{true}} />
              </PixButton>
            </div>
          {{else}}
            <PixButton @triggerAction={{this.editParticipantExternalId}} @size="small" @iconBefore="edit">
              {{t "common.actions.edit"}}
            </PixButton>
          {{/if}}
        </:cell>
      </PixTableColumn>
    {{/if}}
  </template>
}
