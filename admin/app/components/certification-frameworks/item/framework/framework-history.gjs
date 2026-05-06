import PixIcon from "@1024pix/pix-ui/components/pix-icon";
import PixIconButton from "@1024pix/pix-ui/components/pix-icon-button";
import PixTable from "@1024pix/pix-ui/components/pix-table";
import PixTableColumn from "@1024pix/pix-ui/components/pix-table-column";
import PixTag from "@1024pix/pix-ui/components/pix-tag";
import { concat, fn, get } from "@ember/helper";
import { action } from "@ember/object";
import { service } from "@ember/service";
import Component from "@glimmer/component";
import { tracked } from "@glimmer/tracking";
import { t } from "ember-intl";
import formatDate from "ember-intl/helpers/format-date";
import { eq, not } from "ember-truth-helpers";

import CertificationVersionDetailModal from "./certification-version-detail-modal";

const STATUS_COLORS = { ACTIVE: 'success', DRAFT: 'tertiary', ARCHIVED: 'secondary' };

function formatDuration(minutes) {
  if (!minutes) return '-';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export default class FrameworkHistory extends Component {
  @service store;

  @tracked selectedVersion = null;

  @action
  async viewVersion(id) {
    this.selectedVersion = await this.store.findRecord('certification-version', id);
  }

  @action
  closeModal() {
    this.selectedVersion = null;
  }

<template>
    <section class="framework-versions">
      <PixTable
        @variant="admin"
        @caption={{t "components.complementary-certifications.item.framework.history.table.caption"}}
        @data={{@history}}
      >
        <:columns as |version context|>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "components.complementary-certifications.item.framework.history.table.columns.version-id"}}
            </:header>
            <:cell>
              {{version.id}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t
                "components.complementary-certifications.item.framework.history.table.columns.maximum-assessment-length"
              }}
            </:header>
            <:cell>
              {{version.maximumAssessmentLength}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              <PixIcon @name="time" @ariaHidden={{true}} />
              {{t "components.complementary-certifications.item.framework.history.table.columns.assessment-duration"}}
            </:header>
            <:cell>
              {{formatDuration version.assessmentDuration}}
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              <PixIcon @name="calendar" @ariaHidden={{true}} />
              {{t "components.complementary-certifications.item.framework.history.table.columns.start-date"}}
            </:header>
            <:cell>
              <strong>{{if version.startDate (formatDate version.startDate) "-"}}</strong>
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              <PixIcon @name="calendar" @ariaHidden={{true}} />
              {{t "components.complementary-certifications.item.framework.history.table.columns.expiration-date"}}
            </:header>
            <:cell>
              <strong>{{if version.expirationDate (formatDate version.expirationDate) "-"}}</strong>
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "components.complementary-certifications.item.framework.history.table.columns.status"}}
            </:header>
            <:cell>
              <PixTag @color={{get STATUS_COLORS version.status}}>
                {{t (concat "components.complementary-certifications.item.framework.history.statuses." version.status)}}
              </PixTag>
            </:cell>
          </PixTableColumn>
          <PixTableColumn @context={{context}}>
            <:header>
              {{t "components.complementary-certifications.item.framework.history.table.columns.actions"}}
            </:header>
            <:cell>
              <PixIconButton
                @triggerAction={{fn this.viewVersion version.id}}
                @ariaLabel={{t "components.complementary-certifications.item.framework.history.table.actions.view"}}
                @iconName="eye"
              />
              <PixIconButton
                @triggerAction={{this.editVersion}}
                @ariaLabel={{t "components.complementary-certifications.item.framework.history.table.actions.edit"}}
                @iconName="edit"
                @isDisabled={{not (eq version.status "DRAFT")}}
              />
              <PixIconButton
                @triggerAction={{this.deleteVersion}}
                @ariaLabel={{t "components.complementary-certifications.item.framework.history.table.actions.delete"}}
                @iconName="delete"
                @isDisabled={{not (eq version.status "DRAFT")}}
              />
            </:cell>
          </PixTableColumn>
        </:columns>
      </PixTable>
    </section>

    {{#if this.selectedVersion}}
      <CertificationVersionDetailModal @version={{this.selectedVersion}} @onClose={{this.closeModal}} />
    {{/if}}
  </template>
}
