import PixTableColumn from '@1024pix/pix-ui/components/pix-table-column';
import PixTag from '@1024pix/pix-ui/components/pix-tag';
import { LinkTo } from '@ember/routing';
import { t } from 'ember-intl';

import formatDate from '../../../helpers/format-date';

<template>
  <PixTableColumn @context={{@context}}>
    <:header>
      {{t "components.autonomous-courses.list.headers.id"}}
    </:header>
    <:cell>
      {{@item.id}}
    </:cell>
  </PixTableColumn>
  <PixTableColumn @context={{@context}}>
    <:header>
      {{t "components.autonomous-courses.list.headers.name"}}
    </:header>
    <:cell>
      <LinkTo @route="authenticated.autonomous-courses.details" @model={{@item.id}}>
        {{@item.name}}
      </LinkTo>
    </:cell>
  </PixTableColumn>
  <PixTableColumn @context={{@context}}>
    <:header>
      {{t "components.autonomous-courses.list.headers.createdAt"}}
    </:header>
    <:cell>
      {{formatDate @item.createdAt}}
    </:cell>
  </PixTableColumn>
  <PixTableColumn @context={{@context}}>
    <:header>
      {{t "components.autonomous-courses.list.headers.status"}}
    </:header>
    <:cell>
      {{#if @item.archivedAt}}
        <PixTag @color="grey-light">
          {{t "components.autonomous-courses.list.status.archived"}}
        </PixTag>
      {{else}}
        <PixTag @color="green-light">
          {{t "components.autonomous-courses.list.status.active"}}
        </PixTag>
      {{/if}}
    </:cell>
  </PixTableColumn>
</template>
