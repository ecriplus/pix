import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import { fn, get } from '@ember/helper';
import { on } from '@ember/modifier';
import { LinkTo } from '@ember/routing';
import dayjsFormat from 'ember-dayjs/helpers/dayjs-format';
import { t } from 'ember-intl';

import { CONNECTION_TYPES } from '../../helpers/connection-types';
import Cell from '../certificability/cell';
import IconTrigger from '../dropdown/icon-trigger';
import Item from '../dropdown/item';
import LastParticipationDateTooltip from '../ui/last-participation-date-tooltip';

<template>
  <tr
    aria-label={{t "pages.sco-organization-participants.table.row-title"}}
    {{on "click" @onClickLearner}}
    class="tr--clickable"
  >
    {{#if @showCheckbox}}
      <td class="table__column" {{on "click" @onToggleStudent}}>
        <PixCheckbox @screenReaderOnly={{true}} @checked={{@isStudentSelected}}>
          <:label>
            {{t
              "pages.sco-organization-participants.table.column.checkbox"
              firstname=@student.firstName
              lastname=@student.lastName
            }}</:label>
        </PixCheckbox>
      </td>
    {{/if}}
    <td class="ellipsis">
      <LinkTo @route="authenticated.sco-organization-participants.sco-organization-participant" @model={{@student.id}}>
        {{@student.lastName}}
      </LinkTo>
    </td>
    <td class="ellipsis" title={{@student.firstName}}>{{@student.firstName}}</td>
    <td>{{dayjsFormat @student.birthdate "DD/MM/YYYY" allow-empty=true}}</td>
    <td class="ellipsis">{{@student.division}}</td>
    <td class="sco-organization-participant-list-page__authentication-methods">
      {{#each @student.authenticationMethods as |authenticationMethod|}}
        <p>{{t (get CONNECTION_TYPES authenticationMethod)}}</p>
      {{/each}}
    </td>
    <td class="table__column--center">{{@student.participationCount}}</td>
    <td>
      {{#if @student.lastParticipationDate}}
        <div class="organization-participant-list-page__last-participation">
          <span>{{dayjsFormat @student.lastParticipationDate "DD/MM/YYYY" allow-empty=true}}</span>
          <LastParticipationDateTooltip
            @id={{@index}}
            @campaignName={{@student.campaignName}}
            @campaignType={{@student.campaignType}}
            @participationStatus={{@student.participationStatus}}
          />
        </div>
      {{/if}}
    </td>
    <td class="table__column--center">
      <Cell
        @hideCertifiableDate={{@hideCertifiableDate}}
        @certifiableAt={{@student.certifiableAt}}
        @isCertifiable={{@student.isCertifiable}}
      />
    </td>
    <td class="organization-participant-list-page__actions hide-on-mobile">
      {{#if @student.isAssociated}}
        <IconTrigger
          @icon="moreVert"
          @dropdownButtonClass="organization-participant-list-page__dropdown-button"
          @dropdownContentClass="organization-participant-list-page__dropdown-content"
          @ariaLabel={{t "pages.sco-organization-participants.actions.show-actions"}}
        >
          <Item @onClick={{fn @openAuthenticationMethodModal @student}}>
            {{t "pages.sco-organization-participants.actions.manage-account"}}
          </Item>
        </IconTrigger>
      {{/if}}
    </td>
  </tr>
</template>
