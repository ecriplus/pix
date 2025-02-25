import PixCheckbox from '@1024pix/pix-ui/components/pix-checkbox';
import { on } from '@ember/modifier';
import { t } from 'ember-intl';
import { not } from 'ember-truth-helpers';

import Tooltip from '../certificability/tooltip';
import Header from '../table/header';
import HeaderSort from '../table/header-sort';

<template>
  <tr>
    {{#if @showCheckbox}}
      <Header class="table__column--small">
        <PixCheckbox
          @screenReaderOnly={{true}}
          @checked={{@someSelected}}
          @isIndeterminate={{not @allSelected}}
          disabled={{not @hasStudents}}
          {{on "click" @onToggleAll}}
        ><:label>{{t "pages.organization-participants.table.column.mainCheckbox"}}</:label></PixCheckbox>
      </Header>
    {{/if}}
    <Header @size="wide">
      {{t "pages.sup-organization-participants.table.column.student-number"}}
    </Header>
    <HeaderSort
      @display="left"
      @size="medium"
      @onSort={{@sortByLastname}}
      @order={{@lastnameSort}}
      @ariaLabelDefaultSort={{t "pages.organization-participants.table.column.last-name.ariaLabelDefaultSort"}}
      @ariaLabelSortUp={{t "pages.organization-participants.table.column.last-name.ariaLabelSortUp"}}
      @ariaLabelSortDown={{t "pages.organization-participants.table.column.last-name.ariaLabelSortDown"}}
    >
      {{t "pages.organization-participants.table.column.last-name.label"}}
    </HeaderSort>
    <Header @size="wide">{{t "pages.sup-organization-participants.table.column.first-name"}}</Header>
    <Header @size="medium">
      {{t "pages.sup-organization-participants.table.column.date-of-birth"}}
    </Header>
    <Header @size="wide">{{t "pages.sup-organization-participants.table.column.group"}}</Header>
    <HeaderSort
      @size="medium"
      @align="center"
      @onSort={{@sortByParticipationCount}}
      @order={{@participationCountOrder}}
      @ariaLabelDefaultSort={{t
        "pages.sup-organization-participants.table.column.participation-count.ariaLabelDefaultSort"
      }}
      @ariaLabelSortUp={{t "pages.sup-organization-participants.table.column.participation-count.ariaLabelSortUp"}}
      @ariaLabelSortDown={{t "pages.sup-organization-participants.table.column.participation-count.ariaLabelSortDown"}}
    >
      {{t "pages.sup-organization-participants.table.column.participation-count.label"}}
    </HeaderSort>
    <Header @size="medium" @align="center">
      {{t "pages.sup-organization-participants.table.column.last-participation-date"}}
    </Header>
    <Header @size="medium" @align="center">
      <div class="sup-organization-participant-list-page__certificability-header">
        {{t "pages.sup-organization-participants.table.column.is-certifiable.label"}}
        <Tooltip
          @hasComputeOrganizationLearnerCertificabilityEnabled={{@hasComputeOrganizationLearnerCertificabilityEnabled}}
        />
      </div>
    </Header>
    <Header class="hide-on-mobile organization-participant-list-page__actions-header">
      {{t "common.actions.global"}}
    </Header>
  </tr>
</template>
